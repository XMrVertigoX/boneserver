var bonescript = require('bonescript');
var fs = require('fs');

var pins = bonescript.getPlatform().platform.pins;

var timer = require('./timer.js');
var pwm = require('./pwmControl.js');
var gpio = require('./gpioControl.js');

exports.handleRequest = function(request) {
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

			response = pwm.write(pin, parameters.options);
			break;

		case 'digitalRead':
			var pin = parameters.pin;

			response = bonescript[request.type](pin);
			break;

		case 'digitalWrite':
			var pin = parameters.pin;

			//response = bonescript[request.type](pin, parameters.value);

			gpio.write(pins[pin].gpio, {value: parameters.value});
			break;

		case 'getPinMode':
			var pin = parameters.pin;
			var whitelist = JSON.parse(fs.readFileSync('./whitelist.json'));

			if (whitelist.hasOwnProperty(pin)) {
				switch(whitelist[pin].type) {
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

		case 'getPins':
			var list = JSON.parse(fs.readFileSync('./whitelist.json'));

			for (pin in list) {
				list[pin]['pinMode'] = bonescript.getPinMode(pin);
			}

			response = JSON.stringify(list);
			break;
	}

	return response;
}
