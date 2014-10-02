var bonescript = require('bonescript');
var fs = require('fs');
var settings = require('./settings.json');
var websocket = require('./websocket.js');
var gpio = require('./gpioControl.js');

var pins = bonescript.getPlatform().platform.pins;

var timers = {};

var addTimer = function (type, pin) {
    var timerResponse = {};
        timerResponse.parameters = {'pin': pin};
        timerResponse.type = type;
    
    timers[pin] = {};

    switch(type) {
        case 'digitalRead':
            timers[pin].state = null;
            timers[pin].id = setInterval(function () {
                var pinState = gpio.read(pins[pin].gpio).value; //bonescript.digitalRead(pin);

                // Send message only on change
                if (pinState != timers[pin].state) {
                    timers[pin].state = pinState;
                    timerResponse.response = pinState;
                    websocket.write(timerResponse);
                }
            }, settings.gpioSampleRate);
            break;

        case 'analogRead':
            timers[pin].id = setInterval(function () {
                timerResponse.response = [new Date().getTime(), bonescript.analogRead(pin)];
                
                fs.appendFile(settings.dataLocation + pin + '.csv', timerResponse.response[0] + "," + timerResponse.response[1] + "\r\n");

                websocket.write(timerResponse);
            }, settings.adcSampleRate);
            break;
    }
}

var deleteTimer = function (pin) {
    if (timers.hasOwnProperty(pin)) {
        clearInterval(timers[pin].id);
        delete timers[pin];
    }
}

var isRunning = function (pin) {
    return timers.hasOwnProperty(pin);
}

module.exports = {
	addTimer: addTimer,
	deleteTimer: deleteTimer,
	isRunning: isRunning
};
