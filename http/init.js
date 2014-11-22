/*
 * init.js - redenders templates an append click functions
 */

var init = {};

init.init = function () {
	// Init every pin
	for(pin in pins) {
		switch (pins[pin].type) {

		case 'pwm':
			// Get mustache template document
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
			$('#' + pin + 'PeriodValue').prop({
				'min': 1,
				'max': 1000000000,
				'step': 1,
				'disabled': true
			});

			$('#' + pin + 'DutyValue').prop({
				'min': 0,
				'max': 1,
				'step': 0.01,
				'disabled': true
			});

			// TileBtnEnable
			$('#' + pin + 'TileBtnEnable').click(function () {
				bonescriptCtrl.enablePWM(this.title);
			});

			// TileBtnWrite
			$('#' + pin + 'TileBtnWrite').click(function () {
				bonescriptCtrl.analogWrite(this.title, {
					'period': $('#' + this.title + 'PeriodValue').val(),
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

			// GET and append the tile toggle button
			$.ajax({
				type: 'GET',
				url: 'templates/templateTileTglBtn.mustache',
				dataType: 'html',
				success: function (template) {
					$('#PWMTglBtnGrp').append(Mustache.render($(template).html(), {pin: pin}))
				},
				data: {},
				async: false
			});

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
			});

			$('#' + pin + 'TileBtnOFF').click(function () {
				bonescriptCtrl.digitalWrite(this.title, 0);
			});

			$('#' + pin + 'TileBtnIN').click(function () {
				bonescriptCtrl.pinMode(this.title, 'in');
			});

			$('#' + pin + 'TileBtnOUT').click(function () {
				bonescriptCtrl.pinMode(this.title, 'out');
			});

			$('#' + pin + 'TileBtnON').prop('disabled', true);
			$('#' + pin + 'TileBtnOFF').prop('disabled', true);

			// GET and append the tile toggle button
			$.ajax({
				type: 'GET',
				url: 'templates/templateTileTglBtn.mustache',
				dataType: 'html',
				success: function (template) {
					$('#GPIOTglBtnGrp').append(Mustache.render($(template).html(), {pin: pin}))
				},
				data: {},
				async: false
			});

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
				$('#' + pin + 'Download').prop( "disabled", true );
				$('#' + pin + 'Delete').prop( "disabled", true );
			});

			$('#' + pin + 'Stop').click(function () {
				bonescriptCtrl.stopADC(this.title);
				$('#' + pin + 'Download').prop( "disabled", false );
				$('#' + pin + 'Delete').prop( "disabled", false );
			});

			$('#' + pin + 'Download').click(function(e) {
				e.preventDefault(); //stop the browser from following
				window.open('data/' + this.title + '.csv');
			});

			$('#' + pin + 'Delete').click(function () {
				var message = "Delete data series for " + this.title + "?"

				if (confirm(message)) {
					bonescriptCtrl.deleteADCData(this.title);
					diagramCtrl.util.resetData(this.title);
				}
			})

			// Initialize the diagram engine
			diagramCtrl.init(pin);

			// GET and append the tile toggle button
			$.ajax({
				type: 'GET',
				url: 'templates/templateTileTglBtn.mustache',
				dataType: 'html',
				success: function (template) {
					$('#AINTglBtnGrp').append(Mustache.render($(template).html(), {pin: pin}))
				},
				data: {},
				async: false
			});

			break;
		}

		// append toggle function
		$('#' + pin + 'TileTglBtn').click(function () {
			bonescriptCtrl.toggle(this.title);
		});
	}

	// if tile is inactive toggle them via fake response message
	for(pin in pins) {
		if (!pins[pin].active) {
			responseHandler.toggle({parameters: {pin: pin}, response: false});
		}
	}
}