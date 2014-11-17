/*
 * boneControl.js - Manages hardware control requests and provides the
 * bonescript API an some interface control functions.
 *
 * Some functions from the bonescript library do not work properly, they are
 * bypassed but still there as comments to reuse them if the library works.
 */

// Managed modules
var fs = require('fs');
var bonescript = require('bonescript');

// Loads pin descriptions from the bonescript library.
var pins = bonescript.getPlatform().platform.pins;

// Custom modules
var settings = require('./settingsControl.js');
var interface = require('./interfaceControl.js');
var timer = require('./timer.js');

// bonscript bypass modules
var gpio = require('./gpioControl.js');
var pwm = require('./pwmControl.js');

/* 
 * Main function - Takes the whole request object and switches throught
 * request[type] to determine what to do.
 *
 * The request types for functions from the bonescript library are identical
 * to the function names. 
 *
 * Returns the whole request and adds a respose object with the return values
 * of the functions.
 */
var handleRequest = function(request) {
	var parameters = request.parameters;
	var response = {};

	switch(request.type) {
		// BoneScript API
		case 'analogRead':
			var pin = parameters.pin;

			response = bonescript[request.type](pin);
			break;

		case 'analogWrite':
			var pin = parameters.pin;

			//response = bonescript[request.type](pin, parameters.duty, parameters.freq);

			// Bypass to the analogWrite function of the bonescript library
			response = pwm.write(pin, parameters.options);
			break;

		case 'digitalRead':
			var pin = parameters.pin;

			response = bonescript[request.type](pin);
			break;

		case 'digitalWrite':
			var pin = parameters.pin;

			//response = bonescript[request.type](pin, parameters.value);

			// Bypass to the digitalWrite function of the bonescript library
			gpio.write(pins[pin].gpio, {value: parameters.value});
			break;

		case 'getPinMode':
			var pin = parameters.pin;

			if (interface.config.hasOwnProperty(pin)) {
				switch(interface.config[pin].type) {
					case 'pwm':
						response.pwm = pwm.read(pin);
						break;

					case 'gpio':
						response.gpio = gpio.read(pins[pin].gpio);
						break;

					default:
						response = bonescript[request.type](pin);
				}
			}

			break;

		case 'pinMode':
			var pin = parameters.pin;

			//var direction;

			// switch (parameters.direction) {
			// 	case 'in':
			// 		direction = bonescript.INPUT;
			// 		break;
			// 	case 'out':
			// 		direction = bonescript.OUTPUT;
			// 		break;
			// }
			
			gpio.write(pins[pin].gpio, {direction: parameters.direction});

			switch (parameters.direction) {
				case 'in':
					timer.deleteTimer(pin);
					timer.addTimer('digitalRead', pin);
					break;

				case 'out':
					timer.deleteTimer(pin);
					break;
			}

			//response = bonescript[request.type](pin, direction);
			response.gpio = gpio.read(pins[pin].gpio);

			break;

		// Special cases
		case 'enableGPIO':
			var pin = parameters.pin;

			gpio.enable(pins[pin].gpio);
			response.gpio = gpio.read(pins[pin].gpio);
			break;

		case 'disableGPIO':
			var pin = parameters.pin;

			gpio.disable(pins[pin].gpio);
			response.gpio = gpio.read(pins[pin].gpio);
			break;

		case 'enablePWM':
			var pin = parameters.pin;

			pwm.enable(pin);
			response['pwm'] = pwm.read(pin);
			break;

		case 'disablePWM':
			var pin = parameters.pin;

			pwm.disable(pin);
			response['pwm'] = pwm.read(pin);
			break;

		case 'startADC':
			var pin = parameters.pin;

			timer.deleteTimer(pin);
			timer.addTimer('analogRead', pin);
			break;

		case 'stopADC':
			var pin = parameters.pin;
			
			timer.deleteTimer(pin);
			break;

		case 'deleteADCData':
			var pin = parameters.pin;

			var file = settings.dataLocation + '/' + pin + '.csv';

			if (fs.existsSync(file)) {
				fs.unlinkSync(settings.dataLocation + '/' + pin + '.csv');
			}
			break;

		// Interface controls
		case 'getPins':
			// create a deep copy of the interface config object
			var list = JSON.parse(JSON.stringify(interface.config));

			// Attaches the pinMode information to the interface object
			for (pin in list) {
				list[pin]['pinMode'] = bonescript.getPinMode(pin);
			}

			response = JSON.stringify(list);
			break;

		case 'toggle':
			var pin = parameters.pin;
			// var file = './interface.json';
			// var list = JSON.parse(fs.readFileSync(file));

			// if (interface.config.hasOwnProperty(pin)) {
			// 	interface.config[pin].active = !interface.config[pin].active;
			// }

			// set the active state to the opposite
			interface.set(pin, 'active', !interface.get(pin, 'active'));
			response = interface.get(pin, 'active');

			break;
	}

	return response;
}

module.exports = {
	handleRequest: handleRequest
}