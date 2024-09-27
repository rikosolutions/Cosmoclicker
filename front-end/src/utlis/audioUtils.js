let audioContext = null;
const audioElements = {};

export const initializeAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

export const initializeAudio = (audioId, audioUrl) => {
    return new Promise(async (resolve, reject) => {
        if (audioElements[audioId] && audioElements[audioId].audioBuffer) {
            resolve();
            return;
        }
        try {
            initializeAudioContext();

            const data = await fetchAudioData(audioUrl);
            const audioBuffer = await audioContext.decodeAudioData(data);
            audioElements[audioId] = {
                audioBuffer,
                gainNode: audioContext.createGain(),
                source: null
            };

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const fetchAudioData = (audioUrl) => {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', audioUrl, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(new Error('Failed to load audio data'));
            }
        };
        request.onerror = () => reject(new Error('Network error'));
        request.send();
    });
};

export const playAudio = (audioId, volume = 0.5) => {
    const audioElement = audioElements[audioId];
    if (!audioElement || !audioContext) return;

    const { audioBuffer, gainNode } = audioElement;

    audioElement.source = audioContext.createBufferSource();
    audioElement.source.buffer = audioBuffer;
    audioElement.source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    audioElement.source.start(0);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
};

export const stopAudio = (audioId) => {
    const audioElement = audioElements[audioId];
    if (audioElement && audioElement.source) {
        audioElement.source.stop();
        audioElement.source = null;
    }
};

export const Vibration = () => {
    if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500]);
    } else {
        console.log('Vibration not supported on this device.');
    }
};
