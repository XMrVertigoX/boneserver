var responseHandler = {};
	responseHandler.util = {};

responseHandler.analogRead = function(message) {
	if (debug) { console.log("responseHandler.analogRead: " + JSON.stringify(message)) };

	diagramCtrl.util.addValue(message.parameters.pin, message.response);
}

responseHandler.analogWrite = function(message) {
	if (debug) { console.log("responseHandler.analogWrite: " + JSON.stringify(message)) };

	bonescriptCtrl.getPinMode(message['parameters']['pin']);
}

responseHandler.digitalRead = function(message) {
	if (debug) { console.log("responseHandler.digitalRead: " + JSON.stringify(message)) };

	var parameters = message['parameters'];
	var response = message['response'];

	var pin = parameters['pin'];

	if (response) {
		util.changeBtnColor($('#' + pin + 'TileBtnOFF'), 'btn-default');
		util.changeBtnColor($('#' + pin + 'TileBtnON'), 'btn-success');
	} else {
		util.changeBtnColor($('#' + pin + 'TileBtnOFF'), 'btn-danger');
		util.changeBtnColor($('#' + pin + 'TileBtnON'), 'btn-default');
	}
}

responseHandler.digitalWrite = function(message) {
	if (debug) { console.log("responseHandler.digitalWrite: " + 
							 JSON.stringify(message)) };

	var parameters = message['parameters'];
	var response = message['response'];

	var pin = parameters['pin'];

	if (response) {
		if (parameters['value']) {
			util.changeBtnColor($('#' + pin + 'TileBtnOFF'), 'btn-default');
			util.changeBtnColor($('#' + pin + 'TileBtnON'), 'btn-success');
		} else {
			util.changeBtnColor($('#' + pin + 'TileBtnOFF'), 'btn-danger');
			util.changeBtnColor($('#' + pin + 'TileBtnON'), 'btn-default');
		}
	}
}

responseHandler.getPinMode = function(message) {
	if (debug) { console.log("responseHandler.getPinMode: " + JSON.stringify(message)) };

	if (pins[message.parameters.pin].hasOwnProperty('pwm')) {
		if (message.response.hasOwnProperty('pwm')) {
			responseHandler.util.changePWMTile(message.parameters.pin, message.response.pwm.value, message.response.pwm.freq);
		}
	} else if (pins[message.parameters.pin].hasOwnProperty('gpio')) {
		responseHandler.util.changeGPIOTile(message.parameters.pin, message.response.gpio.direction, message.timer);
	}

	pins[message.parameters.pin].pinMode = message.response;
}

responseHandler.pinMode = function(message) {
	if (debug) { console.log("responseHandler.pinMode: " + JSON.stringify(message)) };

	if (message['response']) {
		bonescriptCtrl.getPinMode(message['parameters']['pin']);
	} else {
		console.log(message);
	}
}

responseHandler.enablePWM = function(message) {
	var parameters = message['parameters'];
	var response = message['response'];

	var pin = parameters.pin;

	if (response.hasOwnProperty('path')) {
		if (response.period !== undefined || response.duty !== undefined) {
			var duty = response.duty/response.period;
			var freq = (1/response.period) * Math.pow(10, 9);
		}

		responseHandler.util.changePWMTile(pin, duty, freq, false);
	}
}

responseHandler.disablePWM = function(message) {
	var parameters = message['parameters'];
	var response = message['response'];

	var pin = parameters.pin;

	responseHandler.util.changePWMTile(pin, undefined, undefined, true);
}

responseHandler.readPWM = function(message) {
	console.log(message);
}

responseHandler.startADC = function(message) {
	if (debug) { console.log("responseHandler.startADC: " + 
							 JSON.stringify(message)) };
}

responseHandler.stopADC = function(message) {
	if (debug) { console.log("responseHandler.stopADC: " + JSON.stringify(message)) };
}

responseHandler.getPins = function(message) {
	if (debug) { console.log("responseHandler.getPins: " + JSON.stringify(message)) };

	pins = JSON.parse(message.response);

	init.init();

	for(pin in pins) {
		bonescriptCtrl.getPinMode(pin);
	}
}

responseHandler.util.changeGPIOTile = function(pin, direction, timer) {
	if (direction == 'in') {
		$('#' + pin + 'TileBtnON').prop('disabled', true);
		$('#' + pin + 'TileBtnOFF').prop('disabled', true);
		
		if (timer) {
			util.changeBtnColor($('#' + pin + 'TileBtnIN'), 'btn-primary');
			bonescriptCtrl.digitalRead(pin);
		} else {
			util.changeBtnColor($('#' + pin + 'TileBtnIN'), 'btn-danger');
		}

		util.changeBtnColor($('#' + pin + 'TileBtnOUT'), 'btn-default');
	} else if (direction == 'out') {
		$('#' + pin + 'TileBtnON').prop('disabled', false);
		$('#' + pin + 'TileBtnOFF').prop('disabled', false);

		util.changeBtnColor($('#' + pin + 'TileBtnIN'), 'btn-default');
		util.changeBtnColor($('#' + pin + 'TileBtnOUT'), 'btn-primary');

		bonescriptCtrl.digitalRead(pin);
	}
}
responseHandler.util.changePWMTile = function(pin, duty, freq, enable) {
	//duty = duty.toFixed(2);
	//freq = freq.toFixed(0);

	$('#' + pin + 'TileBtnEnable').prop('disabled', !enable);
	$('#' + pin + 'TileBtnDisable').prop('disabled', enable);

	var tmp;

	if (duty === undefined || freq === undefined) {
		tmp = true;
	} else {
		tmp = false;
		$('#' + pin + 'DutyValue').val(duty);
		$('#' + pin + 'FreqValue').val(freq);
	}


	$('#' + pin + 'FreqValue').prop('disabled', tmp);
	$('#' + pin + 'DutyValue').prop('disabled', tmp);
	$('#' + pin + 'TileBtnWrite').prop('disabled', tmp);
}
