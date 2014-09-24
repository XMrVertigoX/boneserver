var bonescriptCtrl = {};
    bonescriptCtrl.util = {};

// BoneScript API
bonescriptCtrl.analogRead = function(pin) {
    var parameters = {};
        parameters['pin'] = pin;
    
    bonescriptCtrl.util.sendRequest('analogRead', parameters);
}

bonescriptCtrl.analogWrite = function(pin, duty, frequency) {
    var parameters = {};
        parameters['pin'] = pin;
        parameters['duty'] = duty;
        parameters['freq'] = frequency;

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

bonescriptCtrl.pinMode = function(pin, direction, mux, pullup, slew) {
    var parameters = {};
        parameters['pin'] = pin;
        parameters['direction'] = direction;
        parameters['mux'] = mux;
        parameters['pullup'] = pullup;
        parameters['slew'] = slew;

    bonescriptCtrl.util.sendRequest('pinMode', parameters);
}

// Special commands
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

bonescriptCtrl.getPins = function() {
    bonescriptCtrl.util.sendRequest('getPins', null);
}

// Utilities
bonescriptCtrl.util.sendRequest = function(type, parameters) {
    var request = {};
        request['type'] = type;

        if (parameters != null) {
            request['parameters'] = parameters;
        };

    websocket.send(JSON.stringify(request));
}
