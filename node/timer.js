/*
 * timer.js - Timer management module for digital and analog inputs
 */

var bonescript = require('bonescript');
var fs = require('fs');

// pin description list
var pins = bonescript.getPlatform().platform.pins;

var settings = require('./settingsControl.js');
var websocket = require('./websocket.js');

// bonescript bypass module
var gpio = require('./gpioControl.js');

// timer storage object
var timers = {};

/*
 * sets an interval function to read and send values
 */
var addTimer = function (type, pin) {
	var timerResponse = {};
		timerResponse.parameters = {'pin': pin};
		timerResponse.type = type;
	
	timers[pin] = {};

	switch(type) {
		case 'digitalRead':
			timers[pin].state = null;
			timers[pin].id = setInterval(function () {
				// bypass for 'bonescript.digitalRead(pin)'
				var pinState = gpio.read(pins[pin].gpio).value; 

				// Send message only on change
				if (pinState != timers[pin].state) {
					timers[pin].state = pinState;
					timerResponse.response = pinState;
					websocket.write(timerResponse);
				}
			}, settings.get('gpioSampleRate'));
			break;

		case 'analogRead':
			// Creates data directory and links to node/http if not existing
			// if (!fs.existsSync(settings.get('dataLocation'))) {
			// 	fs.mkdirSync(settings.get('dataLocation'), 0755);
			// 	fs.symlinkSync('../node/data', '../http/data');
			// }

			timers[pin].id = setInterval(function () {
				timerResponse.response = [new Date().getTime(), bonescript.analogRead(pin)];
				
				fs.appendFile(settings.get('dataLocation') + '/' + pin + '.csv',
				              timerResponse.response[0] + "," + timerResponse.response[1] + "\r\n");

				websocket.write(timerResponse);
			}, settings.get('adcSampleRate'));
			break;
	}
}

/*
 * stop and delete an existing timer
 */
var deleteTimer = function (pin) {
	if (timers.hasOwnProperty(pin)) {
		clearInterval(timers[pin].id);
		delete timers[pin];
	}
}

/*
 * check if a timer exists for the requested pin
 *
 * returns true if the timer objects has an entry for the requested pin.
 * otherwise false
 */
var isRunning = function (pin) {
	return timers.hasOwnProperty(pin);
}

module.exports = {
	addTimer: addTimer,
	deleteTimer: deleteTimer,
	isRunning: isRunning
}
