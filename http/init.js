var init = {};

init.init = function () {
    for(pin in pins) {
        switch (pins[pin].type) {

        case 'pwm':
            // Get template
            $.ajax({
                type: 'GET',
                url: 'templates/templatePWM.mustache',
                dataType: 'html',
                success: function (template) {
                    $('#PWMTiles').append(Mustache.render($(template).html(), {pin: pin}))
                },
                data: {},
                async: false
            });

            // Inputs
            $('#' + pin + 'FreqValue').prop({
                'min': 0,
                'max': 1000000000,
                'step': 0.000000001,
                'disabled': true
            });

            $('#' + pin + 'DutyValue').prop({
                'min': 0,
                'max': 1,
                'step': 0.000000001,
                'disabled': true
            });

            // TileBtnEnable
            $('#' + pin + 'TileBtnEnable').click(function () {
                bonescriptCtrl.enablePWM(this.title);
            });

            // TileBtnWrite
            $('#' + pin + 'TileBtnWrite').click(function () {
                bonescriptCtrl.analogWrite(this.title, {
                    'frequency': $('#' + this.title + 'FreqValue').val(),
                    'duty': $('#' + this.title + 'DutyValue').val()
                });
            });

            $('#' + pin + 'TileBtnWrite').prop({
                'disabled': true
            });

            // TileBtnDisable
            $('#' + pin + 'TileBtnDisable').click(function () {
                bonescriptCtrl.disablePWM(this.title);
            });
            
            $('#' + pin + 'TileBtnDisable').prop({
                'disabled': true
            });

            // Append HTML
            $('#PWMTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn" class="btn btn-primary btn-block">' + pin + '</button>');

            break;

        case 'gpio':
            $.ajax({
                type: 'GET',
                url: 'templates/templateGPIO.mustache',
                dataType: 'html',
                success: function (template) {
                    $('#GPIOTiles').append(Mustache.render($(template).html(), {pin: pin}));
                },
                data: {},
                async: false
            });

            $('#' + pin + 'TileBtnON').click(function () {
                bonescriptCtrl.digitalWrite(this.title, 1);
            })

            $('#' + pin + 'TileBtnOFF').click(function () {
                bonescriptCtrl.digitalWrite(this.title, 0);
            })

            $('#' + pin + 'TileBtnIN').click(function () {
                bonescriptCtrl.pinMode(this.title, 'in');
            })

            $('#' + pin + 'TileBtnOUT').click(function () {
                bonescriptCtrl.pinMode(this.title, 'out');
            })

            $('#' + pin + 'TileBtnON').prop('disabled', true);
            $('#' + pin + 'TileBtnOFF').prop('disabled', true);

            $('#GPIOTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn"' + 'class="btn btn-primary btn-block">' + pin + '</button>');
            break;

        case 'ain':
            $.ajax({
                type: 'GET',
                url: 'templates/templateAIN.mustache',
                dataType: 'html',
                success: function (template) {
                    $('#AINTiles').append(Mustache.render($(template).html(), {pin: pin}));
                },
                data: {},
                async: false
            });

            $('#' + pin + 'Start').click(function () {
                bonescriptCtrl.startADC(this.title, 1000);
                diagramCtrl.util.resetData(this.title);
            })

            $('#' + pin + 'Stop').click(function () {
                bonescriptCtrl.stopADC(this.title);
            })

            $('#' + pin + 'Data').click(function(e) {
                e.preventDefault();
                window.location.href = 'data/' + this.title + '.csv';
            });

            $('#AINTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn" class="btn btn-primary btn-block">' + pin + '</button>');

            diagramCtrl.init(pin);
            break;
        }

        $('#' + pin + 'TileTglBtn').click(function () {
            var title = this.title;
            
            $('#' + title + 'Tile').toggle({
                duration: 100,
                complete: function () {
                    var isVisible = $('#' + title + 'Tile').is(':visible');
                    var isHidden  = $('#' + title + 'Tile').is(':hidden');

                    if (isVisible) {
                        util.changeBtnColor($('#' + title + 'TileTglBtn'), 'btn-primary');
                    } else if (isHidden) {
                        util.changeBtnColor($('#' + title + 'TileTglBtn'), 'btn-default');
                    }
                }
            });
        })

        // if (!pins[pin].isActivated) {
        //     $('#' + pin + 'Tile').toggle();
        //     util.changeBtnColor($('#' + pin + 'TileTglBtn'), 'btn-default');
        // }
    }
}
