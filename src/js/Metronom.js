var Metronom = function () {
    this.clock = 0;
    this.prevRest = 0;
    this.setBPM();
};
inherits(Metronom, EventEmitter);

Metronom.prototype.check = function (e) {
    var time = e.time;
    var clock = this.clock;
    var rest = (time % clock) / clock;

    if (rest < this.prevRest) {
        this.emit('beat');
    }

    this.prevRest = rest;
};

Metronom.prototype.setBPM = function (bpm) {
    bpm = bpm || 0;

    this.bpm = bpm || 0;
    this.clock = (60 / bpm) * 1000;

    this.emit('change', this.clock);
};
