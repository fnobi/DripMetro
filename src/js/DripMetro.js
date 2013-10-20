(function () {
    function init () {
        var viewerElement = document.getElementById('canvas-drip');

        // init metronom
        var metronom = new Metronom();

        // init bpm meter
        var bpmMeter = new BPMMeter({
            numElement: document.getElementById('num-bpm'),
            downBtnElement: document.getElementById('btn-bpmdown'),
            upBtnElement: document.getElementById('btn-bpmup')
        });

        // init dripview
        var dripView = new DripView({
            el: viewerElement
        });

        // init metro tones
        var metroTones = new MetroTones();

        // init winstatus
        var winstatus = new Winstatus();
        winstatus.on('resize', function () {
            dripView.resizeCanvas(
                winstatus.windowWidth,
                winstatus.windowHeight
            );
        });

        // init ticker
        var ticker = new Ticker({
            clock: 20
        });

        // init events
        ticker.on('tick', function (e) {
            dripView.draw(e);
        });
        ticker.on('tick', function (e) {
            metronom.check(e);
        });

        metronom.on('change', function (clock) {
            dripView.updateClock(clock);
        });

        metronom.on('beat', function () {
            metroTones.play(metronom.bpm / 60);
        });

        bpmMeter.on('change', function (bpm) {
            metronom.setBPM(bpm);
        });

        viewerElement.on('click', function () {
            if (!ticker.loop) {
                metroTones.play();
                ticker.start();
            } else {
                ticker.stop();
            }
        });

        // start
        bpmMeter.setBPM(60);
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();
