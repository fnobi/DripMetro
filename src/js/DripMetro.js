(function () {
    function init () {
        // init bpm meter
        var bpmMeter = new BPMMeter({
            inputElement: document.getElementById('input-bpm'),
            downBtnElement: document.getElementById('btn-bpmdown'),
            upBtnElement: document.getElementById('btn-bpmup')
        });

        // init dripview
        var dripView = new DripView({
            el: document.getElementById('canvas-drip')
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
            metroTones.play();
        });

        // start
        bpmMeter.setBPM(60);
        ticker.start();
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();
