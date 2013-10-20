var BPMMeter = function (opts) {
    this.inputElement = opts.inputElement;
    this.downBtnElement = opts.downBtnElement;
    this.upBtnElement = opts.upBtnElement;

    this.initListeners();
};
inherits(BPMMeter, EventEmitter);

BPMMeter.prototype.setBPM = function (bpm) {
    var inputElement = this.inputElement;
    inputElement.innerHTML = bpm;

    this.bpm = bpm;
    this.emit('change', bpm);
};

BPMMeter.prototype.initListeners = function () {
    var self = this;
    
    var inputElement = this.inputElement;
    var downBtnElement = this.downBtnElement;
    var upBtnElement = this.upBtnElement;


    function bpmDown (e) {
        e.preventDefault();
        self.setBPM(Number(inputElement.innerHTML) - 1);
    }

    function bpmUp (e) {
        e.preventDefault();
        self.setBPM(Number(inputElement.innerHTML) + 1);
    }

    downBtnElement.addEventListener('touchstart', bpmDown, false);
    upBtnElement.addEventListener('touchstart', bpmUp, false);
    downBtnElement.addEventListener('touchmove', bpmDown, false);
    upBtnElement.addEventListener('touchmove', bpmUp, false);


    var mousedownFlag = false;
    downBtnElement.addEventListener('mousedown', function (e) {
        mousedownFlag = true;
        bpmDown(e);
    }, false);
    upBtnElement.addEventListener('mousedown', function (e) {
        mousedownFlag = true;
        bpmUp(e);
    }, false);

    downBtnElement.addEventListener('mousemove', function (e) {
        if (!mousedownFlag) {
            return;
        }
        bpmDown(e);
    }, false);
    upBtnElement.addEventListener('mousemove', function (e) {
        if (!mousedownFlag) {
            return;
        }
        bpmUp(e);
    }, false);

    downBtnElement.addEventListener('mouseup', function (e) {
        mousedownFlag = false;
    }, false);
    upBtnElement.addEventListener('mouseup', function (e) {
        mousedownFlag = false;
    }, false);
    downBtnElement.addEventListener('mouseout', function (e) {
        mousedownFlag = false;
    }, false);
    upBtnElement.addEventListener('mouseout', function (e) {
        mousedownFlag = false;
    }, false);

};










