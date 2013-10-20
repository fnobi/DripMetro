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

        viewerElement.addEventListener('click', function () {
            metroTones.play();
        }, false);

        // start
        bpmMeter.setBPM(60);
        ticker.start();
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();
