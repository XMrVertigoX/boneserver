var responseHandler = {};
    responseHandler.util = {};

responseHandler.analogRead = function(message) {
    if (debug) { console.log("responseHandler.analogRead: " + JSON.stringify(message)) };

    diagramCtrl.util.addValue(message['parameters']['pin'], message['response']);
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

    var parameters = message['parameters'];
    var response = message['response'];

    switch (availablePins[parameters['pin']].type) {
        case 'GPIO':
            if (response.hasOwnProperty('gpio')) {
                responseHandler.util.changeGPIOTile(parameters['pin'], response['gpio']['direction'], message['timer']);
            }

            break;

        case 'PWM':
            if (response.hasOwnProperty('pwm')) {
                responseHandler.util.changePWMTile(parameters['pin'], response['pwm']['value'], response['pwm']['freq']);
            }
    }
}

responseHandler.pinMode = function(message) {
    if (debug) { console.log("responseHandler.pinMode: " + JSON.stringify(message)) };

    if (message['response']) {
        bonescriptCtrl.getPinMode(message['parameters']['pin']);
    } else {
        console.log(message);
    }
}

responseHandler.startADC = function(message) {
    if (debug) { console.log("responseHandler.startADC: " + 
                             JSON.stringify(message)) };
}

responseHandler.stopADC = function(message) {
    if (debug) { console.log("responseHandler.stopADC: " + JSON.stringify(message)) };
}

responseHandler.getAvailablePins = function(message) {
    if (debug) { console.log("responseHandler.getAvailablePins: " + JSON.stringify(message)) };

    availablePins = message.response;

    init.init();

    for(pin in availablePins) {
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
responseHandler.util.changePWMTile = function(pin, duty, freq) {
    if (duty == null) { duty = -1; }
    if (freq == null) { freq = -1; }

    duty = duty.toFixed(2);
    freq = freq.toFixed(0);

    $('#' + pin + 'FreqValue').prop('disabled', false);
    $('#' + pin + 'DutyValue').prop('disabled', false);
    $('#' + pin + 'FreqSlider').slider('enable');
    $('#' + pin + 'DutySlider').slider('enable');
    $('#' + pin + 'TileBtnWrite').prop('disabled', false);

    $('#' + pin + 'DutyValue').val(duty);
    $('#' + pin + 'FreqValue').val(freq);
    $('#' + pin + 'DutySlider').slider('value', duty);
    $('#' + pin + 'FreqSlider').slider('value', freq);
}
