var init = {};

init.init = function() {
    for(pin in availablePins) {

        switch(availablePins[pin].type) {
            case 'GPIO':
                var html = '<!-- ' + pin + ' --><div class="col-md-2 tile"' + pin + '" id="' + pin + 'Tile" align="center"><h4>' + pin + '</h4><p class="btn-group"><button title="' + pin + '" id="' + pin + 'TileBtnON" class="btn btn-lg btn-default">1</button><button title="' + pin + '" id="' + pin + 'TileBtnOFF" class="btn btn-lg btn-default">0</button></p><p class="btn-group"><button title="' + pin + '" id="' + pin + 'TileBtnIN" class="btn btn-xs btn-default">In</button><button title="' + pin + '" id="' + pin + 'TileBtnOUT" class="btn btn-xs btn-default">Out</button></p></div><!-- /' + pin + ' -->';
                
                $('#GPIOTiles').append(html);

                $('#' + pin + 'TileBtnON').click(function() {
                    bonescriptCtrl.digitalWrite(this.title, 1);
                })

                $('#' + pin + 'TileBtnOFF').click(function() {
                    bonescriptCtrl.digitalWrite(this.title, 0);
                })

                $('#' + pin + 'TileBtnIN').click(function() {
                    bonescriptCtrl.setPinMode(this.title, 'in', availablePins[this.title].mux, 'pulldown', 'fast');
                })

                $('#' + pin + 'TileBtnOUT').click(function() {
                    bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'fast');
                })

                $('#' + pin + 'TileBtnON').prop('disabled', true);
                $('#' + pin + 'TileBtnOFF').prop('disabled', true);

                $('#GPIOTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn"' + 'class="btn btn-primary btn-block">' + pin + '</button>');
                    
                // $('#' + pin + 'TileTglBtn').click(function() {
                //     var title = this.title;
                    
                //     $('#' + title + 'Tile').toggle({
                //         duration: 100,
                //         complete: function() {
                //             var isVisible = $('#' + title + 'Tile').is(':visible');
                //             var isHidden  = $('#' + title + 'Tile').is(':hidden');

                //             if (isVisible) {
                //                 util.changeBtnColor($('#' + title + 'TileTglBtn'), 'btn-primary');
                //             } else if (isHidden) {
                //                 util.changeBtnColor($('#' + title + 'TileTglBtn'), 'btn-default');
                //             }
                //         }
                //     });
                // })

                break;

            case 'PWM':
                var maxPWMFrequency = 1000000; // 1MHz. Experimental...
                var html =  '<!-- ' + pin + ' --><div class="col-md-3 tile" title="' + pin + '" id="' + pin + 'Tile" align="center"><h4>' + pin + '</h4><p><div class="input-group input-group-sm"><span class="input-group-addon">Freq</span><input title="' + pin + '" id="' + pin + 'FreqValue" class="form-control" type="number"></div></p><p><div title="' + pin + '" id="' + pin + 'FreqSlider"></div></p><p><div class="input-group input-group-sm"><span class="input-group-addon">Duty</span><input title="' + pin + '" id="' + pin + 'DutyValue" class="form-control" type="number"></div></p><p><div title="' + pin + '" id="' + pin + 'DutySlider"></div></p><P><table width="100%"><tr><td align="left"><button title="' + pin + '" id="' + pin + 'TileBtnEnable" class="btn btn-xs btn-default">Enable</button></td><td align="right"><button title="' + pin + '" id="' + pin + 'TileBtnWrite" class="btn btn-xs btn-default">Write</button></td></tr></table></P></div><!-- /' + pin + ' -->';
                
                $('#PWMTiles').append(html);

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

                $('#' + pin + 'FreqValue').change(function() {
                    $('#' + this.title + 'FreqSlider').slider('value', $('#' + this.title + 'FreqValue').val());
                })

                $('#' + pin + 'DutyValue').change(function() {
                    $('#' + this.title + 'DutySlider').slider('value', $('#' + this.title + 'DutyValue').val());
                })

                // if (pin == 'P8_13' || pin == 'P8_19') {
                //     $('#' + pin + 'TileBtnEnable').click(function() {
                //         bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'disabled');
                //     })
                // } else if (pin == 'P9_14' || pin == 'P9_16') {
                //     $('#' + pin + 'TileBtnEnable').click(function() {
                //         bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'disabled');
                //     })
                // } else if (pin == 'P9_21' || pin == 'P9_22') {
                //     $('#' + pin + 'TileBtnEnable').click(function() {
                //         bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'disabled');
                //     })
                // } else if (pin == 'P9_42') {
                //     $('#' + pin + 'TileBtnEnable').click(function() {
                //         bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'disabled');
                //     })
                // }

                $('#' + pin + 'TileBtnEnable').click(function() {
                    bonescriptCtrl.setPinMode(this.title, 'out', availablePins[this.title].mux, 'disabled', 'fast');
                })

                $('#' + pin + 'TileBtnWrite').click(function() {
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
                
                // $('#' + pin + 'TileTglBtn').click(function() {
                //     $('#' + this.title + 'Tile').toggle();
                // })

                break;

            case 'AIN':
                var html = '<!-- ' + pin + ' --><div class="col-md-12 tile" title="' + pin + '" id="' + pin + 'Tile"><h4 align="left">' + pin + '</h4><p><div class="flotContainer"><div title="' + pin + '" id="' + pin + 'FlotPlaceholder" class="flotPlaceholder"></div></div></p><p align="right"><button class="btn btn-default" title="' + pin + '" id="' + pin + 'Start">Start</button><button class="btn btn-default" title="' + pin + '" id="' + pin + 'Stop">Stop</button></p></div><!-- /' + pin + ' -->';

                    $('#AINTiles').append(html);

                    $('#' + pin + 'Start').click(function() {
                        bonescriptCtrl.startADC(this.title, 1000);
                        diagramCtrl.util.resetData(this.title);
                    })

                    $('#' + pin + 'Stop').click(function() {
                        bonescriptCtrl.stopADC(this.title);
                    })

                    $('#AINTglBtnGrp').append('<button title="' + pin + '" id="' + pin + 'TileTglBtn" class="btn btn-primary btn-block">' + pin + '</button>');
                    
                    // $('#' + pin + 'TileTglBtn').click(function() {
                    //     $('#' + this.title + 'Tile').toggle();
                    // })

                    diagramCtrl.init(pin);

                    break;
        }

        $('#' + pin + 'TileTglBtn').click(function() {
            var title = this.title;
            
            $('#' + title + 'Tile').toggle({
                duration: 100,
                complete: function() {
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

        if (!availablePins[pin].isActivated) {
            $('#' + pin + 'Tile').toggle();
            util.changeBtnColor($('#' + pin + 'TileTglBtn'), 'btn-default');
        };
    }
}
