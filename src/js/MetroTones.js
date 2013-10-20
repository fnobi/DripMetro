var MetroTones = function () {
    var prepared = false;
    this.initToneMap();
};

MetroTones.prototype.initToneMap = function () {
    var self = this;
    var toneMap = new ToneMap({
        tap: '/sounds/tap.wav'
    });

    toneMap.on('load', function () {
        self.prepared = true;
    });
    toneMap.load();

    this.toneMap = toneMap;
};

MetroTones.prototype.play = function (speed) {
    if (!this.prepared) {
        return;
    }

    speed = speed || 1.0;

    this.toneMap.play('tap', {
        playbackRate: speed
    });
};






