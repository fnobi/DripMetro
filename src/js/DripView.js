var DripView = function (opts) {
    this.el = opts.el || document.createElement('canvas');
    this.clock = opts.clock || 0;

    this.width = 0;
    this.height = 0;

    this.prevValue = 0;

    this.ctx = this.el.getContext('2d');

    this.updateClock(this.clock);
};
inherits(DripView, EventEmitter);

DripView.prototype.updateClock = function (clock) {
    this.clock = clock;
};

DripView.prototype.resizeCanvas = function (w, h) {
    var el = this.el;
    el.width = this.width = w;
    el.height = this.height = h;
};

DripView.prototype.clear = function () {
    this.el.width = this.width;
};

DripView.prototype.draw = function (e) {
    var ctx = this.ctx;
    var width = this.width;
    var height = this.height;
    var clock = this.clock;

    var curveWidth = width * 0.1;

    var time = e.time;
    var value = (time % clock) / clock;

    var dropHeight = value * height * 0.5;

    this.clear();

    ctx.fillStyle = '#3fe4fe';
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
        width * 0.5,              0,
        width * 0.5 - curveWidth, dropHeight,
        width * 0.5,              dropHeight
    );
    ctx.bezierCurveTo(
        width * 0.5 + curveWidth, dropHeight,
        width * 0.5,              0,
        width * 1,                0
    );
    ctx.fill();

    this.prevValue = value;
};
