var bonescript = require('bonescript');
var fs = require('fs');
var timer = require('./timer.js');

exports.handleRequest = function(request) {
    var parameters = request.parameters;
    var response;

    switch(request.type) {
        // BoneScript API
        case 'analogRead':
            response = bonescript[request.type](parameters.pin);
            break;

        case 'analogWrite':
            response = bonescript[request.type](parameters.pin, parameters.duty, parameters.freq);
            break;

        case 'digitalRead':
            response = bonescript[request.type](parameters.pin);
            break;

        case 'digitalWrite':
            response = bonescript[request.type](parameters.pin, parameters.value);
            break;

        case 'getPinMode':
            response = bonescript[request.type](parameters.pin);
            break;

        case 'pinMode':
            try {
                response = bonescript[request.type](parameters.pin, parameters.direction, parameters.mux, parameters.pullup, parameters.slew);

                switch (parameters.direction) {
                    case 'in':
                        timer.deleteTimer(parameters.pin);
                        timer.addTimer('digitalRead', parameters.pin);
                        break;

                    case 'out':
                        timer.deleteTimer(parameters.pin);
                        break;
                }
            } catch (error) {
                console.error(error);
                response = "error";
            }

            break;

        // Special cases
        case 'startADC':
            timer.deleteTimer(parameters.pin);
            timer.addTimer('analogRead', parameters.pin);
            break;

        case 'stopADC':
            timer.deleteTimer(parameters.pin);
            break;

        case 'getPins':
            response = JSON.stringify(bonescript.getPlatform().platform.pins);
            break;
    }

    return response;
}
