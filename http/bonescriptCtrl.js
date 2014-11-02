/*
 * bonescriptCtrl.js - 
 */

var bonescriptCtrl = {};
	bonescriptCtrl.util = {};

// BoneScript API
bonescriptCtrl.analogRead = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;
	
	bonescriptCtrl.util.sendRequest('analogRead', parameters);
}

bonescriptCtrl.analogWrite = function(pin, options) {
	var parameters = {};
		parameters['pin'] = pin;
		parameters['options'] = options;

	bonescriptCtrl.util.sendRequest('analogWrite', parameters);
}

bonescriptCtrl.digitalRead = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('digitalRead', parameters);
}

bonescriptCtrl.digitalWrite = function(pin, value) {
	var parameters = {};
		parameters['pin'] = pin;
		parameters['value'] = value;

	bonescriptCtrl.util.sendRequest('digitalWrite', parameters);
}

bonescriptCtrl.getPinMode = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('getPinMode', parameters);
}

bonescriptCtrl.pinMode = function(pin, direction) {
	var parameters = {};
		parameters['pin'] = pin;
		parameters['direction'] = direction;
		parameters['pulldown'] = 1;

	bonescriptCtrl.util.sendRequest('pinMode', parameters);
}

// Special commands
bonescriptCtrl.enablePWM = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('enablePWM', parameters);
}

bonescriptCtrl.disablePWM = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('disablePWM', parameters);
}

bonescriptCtrl.startADC = function(pin, sampleRate) {
	var parameters = {};
		parameters['pin'] = pin;
		parameters['sampleRate'] = sampleRate;

	bonescriptCtrl.util.sendRequest('startADC', parameters);
}

bonescriptCtrl.stopADC = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('stopADC', parameters);
}

bonescriptCtrl.deleteADCData = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('deleteADCData', parameters);
}

bonescriptCtrl.getPins = function() {
	bonescriptCtrl.util.sendRequest('getPins');
}

bonescriptCtrl.toggle = function(pin) {
	var parameters = {};
		parameters['pin'] = pin;

	bonescriptCtrl.util.sendRequest('toggle', parameters);
}

// Utilities
bonescriptCtrl.util.sendRequest = function(type, parameters) {
	var request = {};
		request['type'] = type;

		if (parameters != undefined) {
			request['parameters'] = parameters;
		};

	websocket.send(JSON.stringify(request));
}
