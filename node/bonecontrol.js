var bonescript = require('bonescript');
var fs = require('fs');
var timer = require('./timer.js');

exports.handleRequest = function(request) {
    var parameters = request.parameters;
    var response;

    switch(request.type) {
        // BoneScript API
        case 'analogRead':
            response = bonescript.analogRead(parameters.pin);
            break;

        case 'analogWrite':
            response = bonescript.analogWrite(parameters.pin, parameters.duty, parameters.freq);
            break;

        case 'digitalRead':
            response = bonescript.digitalRead(parameters.pin);
            break;

        case 'digitalWrite':
            response = bonescript.digitalWrite(parameters.pin, parameters.value);
            break;

        case 'getPinMode':
            response = bonescript.getPinMode(parameters.pin);
            break;

        case 'setPinMode':
            response = bonescript.pinMode(parameters.pin, parameters.direction, parameters.mux, parameters.pullup, parameters.slew);

            switch (parameters.direction) {
                case 'in':
                    timer.deleteTimer(parameters.pin);
                    timer.addTimer('digitalRead', parameters.pin);
                    
                    break;

                case 'out':
                    timer.deleteTimer(parameters.pin);
                    break;
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

        case 'getAvailablePins':
            response = JSON.parse(fs.readFileSync('./availablePins.json'));
            break;
    }

    return response;
}
