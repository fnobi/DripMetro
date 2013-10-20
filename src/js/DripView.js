var DripView = function (opts) {
    this.el = opts.el || document.createElement('canvas');
    this.clock = opts.clock || 60;

    this.width = 0;
    this.height = 0;

    this.ctx = this.el.getContext('2d');
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

    this.clear();
    
    ctx.fillRect(0, 0, width, height * 0.1);
};
