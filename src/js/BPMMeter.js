var BPMMeter = function (opts) {
    this.inputElement = opts.inputElement;
    this.downBtnElement = opts.downBtnElement;
    this.upBtnElement = opts.upBtnElement;

    this.initListeners();
};
inherits(BPMMeter, EventEmitter);

BPMMeter.prototype.setBPM = function (bpm) {
    var inputElement = this.inputElement;
    inputElement.value = bpm;

    this.bpm = bpm;
    this.emit('change', bpm);
};

BPMMeter.prototype.initListeners = function () {
    var self = this;
    
    var inputElement = this.inputElement;
    var downBtnElement = this.downBtnElement;
    var upBtnElement = this.upBtnElement;

    inputElement.addEventListener('change', function () {
        self.setBPM(inputElement.value);
    }, false);
    downBtnElement.addEventListener('click', function () {
        self.setBPM(Number(inputElement.value) - 1);
    }, false);
    upBtnElement.addEventListener('click', function () {
        self.setBPM(Number(inputElement.value) + 1);
    }, false);
};
