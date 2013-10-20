var MetroTones = function () {
    var prepared = false;
    this.prepare();
};

MetroTones.prototype.prepare = function () {
    var self = this;

    var AudioContext = getAudioContext();
    var context = new AudioContext();
    var buffer = null;

    var url = '/sounds/tap.wav';

    var request;

    async([function (next) {
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        
        request.send();
        request.onload = next;
    }, function (next) {
        context.decodeAudioData(request.response, function (buf) {
            buffer = buf;
            next();
        }, function (e) {
            alert(e);
        });
    }, function () {
        self.context = context;
        self.buffer = buffer;
        self.prepared = true;
    }]);
};

MetroTones.prototype.play = function () {
    if (!this.prepared) {
        return;
    }

    var context = this.context;
    var buffer = this.buffer;

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(0);
};






