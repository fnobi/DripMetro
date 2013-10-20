var getAudioContext = function () {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        return AudioContext;
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
};
