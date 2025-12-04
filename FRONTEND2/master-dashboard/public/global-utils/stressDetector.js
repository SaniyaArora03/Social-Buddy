let latestStress = 0;
let popupShown = false;
let video = null;

async function sendFrameToBackend() {
    if (!video) return;
    if (video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

    try {
        const res = await fetch('http://127.0.0.1:5000/detect_stress', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({image_base64: dataUrl})
        });

        const json = await res.json();
        latestStress = json.stress || 0;

        const dbg = document.getElementById('dbgStress');
        if (dbg) dbg.textContent = latestStress.toFixed(2);

        if (latestStress > 0.55 && !popupShown) {
            popupShown = true;
            if (confirm("You seem stressed. Switch to easier questions?")) {
                if (window.onStressReduce) window.onStressReduce();
            }
        }

        if (latestStress < 0.55) popupShown = false;

    } catch (err) {
        console.warn("Error sending frame:", err);
    }
}

async function startStressCapture(intervalMs = 1500) {
    try {
        video = document.getElementById("videoStream");

        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        video.srcObject = stream;

        setInterval(sendFrameToBackend, intervalMs);

    } catch (err) {
        console.error("Webcam could not start:", err);
    }
}

function getStressLevel() {
    return latestStress;
}

function initStressDetectorAuto(intervalMs = 1500) {
    startStressCapture(intervalMs);
}


function attachStressDebugElement(el) {
    if (el) {
        el.textContent = latestStress.toFixed(2);
    }
}

window.getStressLevel = getStressLevel;
window.startStressCapture = startStressCapture;
window.initStressDetectorAuto = initStressDetectorAuto;
window.attachStressDebugElement = attachStressDebugElement;
