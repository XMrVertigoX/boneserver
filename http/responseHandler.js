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

	var parameters = message.parameters;
	var response = message.response;

	var pin = parameters.pin;

	if (response == 1) {
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

	var parameters = message.parameters;
	var response = message.response;

	if (response.hasOwnProperty('pwm')) {
		var pwm = response.pwm;
		var active = pwm.hasOwnProperty('path');

		responseHandler.util.changePWMTile(parameters.pin, pwm.duty, pwm.period, active);
	} else if (response.hasOwnProperty('gpio')) {
		var gpio = response.gpio;

		responseHandler.util.changeGPIOTile(parameters.pin, gpio.direction, message.timer);
	}

	pins[parameters.pin].pinMode = response;
}

responseHandler.pinMode = function(message) {
	if (debug) { console.log("responseHandler.pinMode: " + JSON.stringify(message)) };

	if (message.response) {
		bonescriptCtrl.getPinMode(message.parameters.pin);
	} else {
		console.log(message);
	}
}

responseHandler.enablePWM = function(message) {
	var parameters = message.parameters;
	var response = message.response;
	var pin = parameters.pin;

	var active;

	if (response.hasOwnProperty('pwm')) {
		var pwm = response.pwm;
		var active = pwm.hasOwnProperty('path');

		responseHandler.util.changePWMTile(parameters.pin, pwm.duty, pwm.period, active);
	}
}

responseHandler.disablePWM = function(message) {
	var parameters = message['parameters'];
	var response = message['response'];

	if (response.hasOwnProperty('pwm')) {
		var pwm = response.pwm;
		var active = pwm.hasOwnProperty('path');

		responseHandler.util.changePWMTile(parameters.pin, pwm.duty, pwm.period, active);
	}
}

responseHandler.startADC = function(message) {
	if (debug) { console.log("responseHandler.startADC: " + 
							 JSON.stringify(message)) };
}

responseHandler.stopADC = function(message) {
	if (debug) { console.log("responseHandler.stopADC: " + JSON.stringify(message)) };
}

responseHandler.deleteADCData = function(message) {
	if (debug) { console.log("responseHandler.deleteADCData: " + 
							 JSON.stringify(message)) };
}

responseHandler.getPins = function(message) {
	if (debug) { console.log("responseHandler.getPins: " + JSON.stringify(message)) };

	pins = JSON.parse(message.response);

	init.init();

	for(pin in pins) {
		bonescriptCtrl.getPinMode(pin);
	}
}

responseHandler.toggle = function(message) {
	var parameters = message['parameters'];
	var response = message['response'];

	if (response == !$('#' + parameters.pin + 'Tile').is(':visible')) {
		$('#' + parameters.pin + 'Tile').toggle({
	        duration: 250,
	        complete: function () {
	            var isVisible = $('#' + parameters.pin + 'Tile').is(':visible');
	            var isHidden  = $('#' + parameters.pin + 'Tile').is(':hidden');

	            if (isVisible) {
	                util.changeBtnColor($('#' + parameters.pin + 'TileTglBtn'), 'btn-primary');
	            } else if (isHidden) {
	                util.changeBtnColor($('#' + parameters.pin + 'TileTglBtn'), 'btn-default');
	            }
	        }
	    });
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

responseHandler.util.changePWMTile = function(pin, duty, period, enable) {
	$('#' + pin + 'TileBtnEnable').prop('disabled', enable);
	$('#' + pin + 'TileBtnDisable').prop('disabled', !enable);

	var writable;

	if (duty !== undefined && period !== undefined) {
		var duty = duty/period;

		writable = true;

		$('#' + pin + 'DutyValue').val(duty);
		$('#' + pin + 'PeriodValue').val(period);
	}

	$('#' + pin + 'PeriodValue').prop('disabled', !writable);
	$('#' + pin + 'DutyValue').prop('disabled', !writable);
	$('#' + pin + 'TileBtnWrite').prop('disabled', !writable);
}
