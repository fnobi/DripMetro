(function () {
    var HEADER_HEIGHT = 44;
    var FOOTER_HEIGHT = 44;
    var MAX_WIDTH = 320;

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
                Math.min(winstatus.windowWidth, MAX_WIDTH),
                winstatus.windowHeight - HEADER_HEIGHT - FOOTER_HEIGHT
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

        viewerElement.addEventListener('click', function () {
            if (!ticker.loop) {
                metroTones.play();
                ticker.start();
                viewerElement.className = 'active';
            } else {
                ticker.stop();
                viewerElement.className = null;
            }
        }, false);

        // start
        bpmMeter.setBPM(60);
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();
