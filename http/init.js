var init = {};

init.init = function () {
    for(pin in pins) {

        if (pins[pin].hasOwnProperty('pwm')) {
            $.ajax({
                type: 'GET',
                url: 'templatePWM.html',
                dataType: 'html',
                success: function (template) {
                $('#PWMTiles').append(Mustache.render($(template).html(), {pin: pin}));},
                data: {},
                async: false
            });

            var maxPWMFrequency = 1000000; // 1MHz. Experimental...


            $('#' + pin + 'FreqSlider').slider({
                'min': 0,
                'max': maxPWMFrequency,

                slide: function(event, ui) {
                    $('#' + this.title + 'FreqValue').val($('#' + this.title + 'FreqSlider').slider('value'));
                },

                stop: function(event, ui) {
                    $('#' + this.title + 'FreqValue').val($('#' + this.title + 'FreqSlider').slider('value'));
                }
            })

            $('#' + pin + 'DutySlider').slider({
                'min': 0,
                'max': 1,
                'step': 0.01,

                slide: function(event, ui) {
                    $('#' + this.title + 'DutyValue').val($('#' + this.title + 'DutySlider').slider('value'));
                },

                stop: function(event, ui) {
                    $('#' + this.title + 'DutyValue').val($('#' + this.title + 'DutySlider').slider('value'));
                }
            })

            $('#' + pin + 'FreqValue').change(function () {
                $('#' + this.title + 'FreqSlider').slider('value', $('#' + this.title + 'FreqValue').val());
            })

            $('#' + pin + 'DutyValue').change(function () {
                $('#' + this.title + 'DutySlider').slider('value', $('#' + this.title + 'DutyValue').val());
            })

            $('#' + pin + 'TileBtnEnable').click(function () {
                bonescriptCtrl.setPinMode(this.title, 'out', pins[this.title].mux, 'disabled', 'fast');
            })

            $('#' + pin + 'TileBtnWrite').click(function () {
                bonescriptCtrl.analogWrite(this.title, $('#' + this.title + 'DutyValue').val(), $('#' + this.title + 'FreqValue').val());
            })

            $('#' + pin + 'FreqValue').prop('min', 0);
            $('#' + pin + 'FreqValue').prop('max', maxPWMFrequency);

            $('#' + pin + 'DutyValue').prop('min', 0);
            $('#' + pin + 'DutyValue').prop('max', 1);
            $('#' + pin + 'DutyValue').prop('step', 0.01);

            $('#' + pin + 'FreqValue').prop('disabled', true);
            $('#' + pin + 'FreqSlider').slider('disable');
            $('#' + pin + 'DutyValue').prop('disabled', true);
            $('#' + pin + 'DutySlider').slider('disable');

            $('#' + pin + 'TileBtnWrite').prop('disabled', true);

            $('#PWMTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn" class="btn btn-primary btn-block">' + pin + '</button>');
        } else if (pins[pin].hasOwnProperty('gpio')) {
            $.ajax({
                type: 'GET',
                url: 'templateGPIO.html',
                dataType: 'html',
                success: function (template) {
                $('#GPIOTiles').append(Mustache.render($(template).html(), {pin: pin}));},
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
                bonescriptCtrl.setPinMode(this.title, 'in', pins[this.title].mux, 'pulldown', 'fast');
            })

            $('#' + pin + 'TileBtnOUT').click(function () {
                bonescriptCtrl.setPinMode(this.title, 'out', pins[this.title].mux, 'disabled', 'fast');
            })

            $('#' + pin + 'TileBtnON').prop('disabled', true);
            $('#' + pin + 'TileBtnOFF').prop('disabled', true);

            $('#GPIOTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn"' + 'class="btn btn-primary btn-block">' + pin + '</button>');
        } else if (pins[pin].hasOwnProperty('ain')) {
            var html = '<!-- ' + pin + ' --><div class="col-md-12 tile" title="' + pin + '" id="' + pin + 'Tile"><h4 align="left">' + pin + '</h4><p><div class="flotContainer"><div title="' + pin + '" id="' + pin + 'FlotPlaceholder" class="flotPlaceholder"></div></div></p><p align="right"><button class="btn btn-default" title="' + pin + '" id="' + pin + 'Start">Start</button><button class="btn btn-default" title="' + pin + '" id="' + pin + 'Stop">Stop</button></p></div><!-- /' + pin + ' -->';

            $('#AINTiles').append(html);

            $('#' + pin + 'Start').click(function () {
                bonescriptCtrl.startADC(this.title, 1000);
                diagramCtrl.util.resetData(this.title);
            })

            $('#' + pin + 'Stop').click(function () {
                bonescriptCtrl.stopADC(this.title);
            })

            $('#AINTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn" class="btn btn-primary btn-block">' + pin + '</button>');

            diagramCtrl.init(pin);
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
