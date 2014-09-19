// Namespace for diagram data and control functions
var diagramCtrl = {};
    diagramCtrl.util = {};

diagramCtrl.init = function(pin) {
    diagramCtrl[pin] = {};

    diagramCtrl[pin]['data'] = [];

    diagramCtrl[pin]['options'] = { yaxis: {show: true, min: 0, max: 1},
                                    xaxis: {show: false},
                                    lines: {show: true},
                                    points: {show: false},
                                    series: {shadowSize: 0} };

    diagramCtrl[pin]['plot'] = $.plot('#' + pin + 'FlotPlaceholder',
                                      [diagramCtrl[pin]['data']], diagramCtrl[pin]['options']);

    diagramCtrl[pin]['timer'] = setInterval(function() {
        var points = 400;

        if (diagramCtrl[pin]['data'].length > points) {
            diagramCtrl[pin]['data'].splice(0, diagramCtrl[pin]['data'].length - points);
        };

        diagramCtrl[pin]['plot'].setData([diagramCtrl[pin]['data']]);
        diagramCtrl[pin]['plot'].setupGrid();
        diagramCtrl[pin]['plot'].draw();
    }, 40); // Redraw at 25Hz
}

diagramCtrl.util.addValue = function(pin, data) {
    diagramCtrl[pin]['data'].push(data);
}

diagramCtrl.util.resetData = function(pin) {
    diagramCtrl[pin]['data'].length = 0;
}
