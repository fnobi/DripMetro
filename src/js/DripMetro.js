function init () {
    var bpm = 60;
    var clock = (bpm / 60) * 1000;

    // init dripview
    var dripView = new DripView({
        el: document.getElementById('canvas-drip'),
        clock: clock
    });

    // init winstatus
    var winstatus = new Winstatus();
    winstatus.on('resize', function () {
        dripView.resizeCanvas(winstatus.windowWidth, winstatus.windowHeight);
    });

    // init ticker
    var ticker = new Ticker({
        clock: 20
    });

    // init events
    ticker.on('tick', function () {
        dripView.draw();
    });

    ticker.start();
}

window.addEventListener('DOMContentLoaded', init, false);











