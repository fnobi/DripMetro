(function () {
    function init () {
        var viewerElement = document.getElementById('canvas-drip');

        // init bpm meter
        var bpmMeter = new BPMMeter({
            inputElement: document.getElementById('num-bpm'),
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
            dripView.resizeCanvas(winstatus.windowWidth, winstatus.windowHeight);
        });

        // init ticker
        var ticker = new Ticker({
            clock: 20
        });

        // init events
        ticker.on('tick', function (e) {
            dripView.draw(e);
        });

        bpmMeter.on('change', function (bpm) {
            dripView.updateBPM(bpm);
        });

        dripView.on('beat', function () {
            metroTones.play(dripView.bpm / 60);
        });

        bpmMeter.on('click', function () {
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
