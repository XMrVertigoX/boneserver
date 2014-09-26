var exec = require('child_process').exec;
var execSync = require('exec-sync');

if (execSync('./dtboControl.sh slots ').match('am33xx_pwm') == null) {
	execSync('./dtboControl.sh enable am33xx_pwm');
}

var pwmPrefix = 'bone_pwm_';
var pinPattern = /P[8|9]_[1-4][0-9]/i;

var disable = function(pin) {
	if (!isValid) return false;

	var pwm = get(pin);

	if (pwm.hasOwnProperty(pin)) {
		execSync('./dtboControl.sh disable ' + pwm[pin].slot);
	}
}

var enable = function(pin) {
	if (!isValid) return false;
	
	var pwm = get(pin);

	if (!pwm.hasOwnProperty(pin)) {
		execSync('./dtboControl.sh enable ' + pwmPrefix + pin);
	}
}

var get = function(pin) {
	var pwm = {}
	var slots = getSlots();

	if (slots.hasOwnProperty(pin)) {
		pwm[pin] = {};
		pwm[pin].slot = slots[pin].slot;
		pwm[pin].path = execSync('./pwmControl.sh path ' + pin);
		pwm[pin].active = isActive(pin);

		if (pwm[pin].active) {
			pwm[pin].duty = execSync('./pwmControl.sh get_duty ' + pwm[pin].path);
			pwm[pin].period = execSync('./pwmControl.sh get_period ' + pwm[pin].path);
			pwm[pin].polarity = execSync('./pwmControl.sh get_polarity ' + pwm[pin].path);
			pwm[pin].run = execSync('./pwmControl.sh get_run ' + pwm[pin].path);
		}
	}

	return pwm;
}

var getSlots = function() {
	var lines = execSync('./dtboControl.sh slots ').split('\n');
	var slots = {};

	for (var i = 0; i < lines.length; i++) {
		var split = lines[i].split(',');
		var name = split[split.length - 1].match(pinPattern)

		if (name != null) {
			var pin = split[split.length - 1].match(pinPattern);
			var slot = lines[i].split(':')[0];
			slots[pin] = {slot: slot};
		}
		
	}

	return slots;
}

var isActive = function(pin) {
	var ls = execSync('./pwmControl.sh ls ' + pin);

	// checks if one of the required files is avalable.
	if (ls.match(/duty|period|polarity|run/g) != null) {
		return true;
	} else {
		return false;
	}
}

var isValid = function(pin) {
	if (pin.match(pinPattern != null)) {
		return true;
	} else {
		return false;
	}
}

var set = function(pin, options) {
	if (!isValid) return false;

	var pwm = get(pin);

	if (pwm.hasOwnProperty(pin)) {
		if (pwm[pin].active) {
			if (options.hasOwnProperty('frequency')) {
				var period_ns = (1/options.frequency) * Math.pow(10, 9);

				if (options.hasOwnProperty('duty')) {
					var duty_ns = period_ns * options.duty;
				} else {
					var duty_ns = (pwm[pin].duty/pwm[pin].period) * period_ns;
				}

				try {
					execSync('./pwmControl.sh set_duty ' + 0 + ' ' + pwm[pin].path);
					execSync('./pwmControl.sh set_period ' + period_ns + ' ' + pwm[pin].path);
					execSync('./pwmControl.sh set_duty ' + duty_ns + ' ' + pwm[pin].path);
				} catch(e) {
					console.error(e);
				}
			} else if (options.hasOwnProperty('duty')) {
				var duty_ns = pwm[pin].period * options.duty;

				try {
					execSync('./pwmControl.sh set_duty ' + duty_ns + ' ' + pwm[pin].path);
				} catch(e) {
					console.error(e);
				}
			}

			if (options.hasOwnProperty('run')) {
				try {
					execSync('./pwmControl.sh set_run ' + options.run + ' ' + pwm[pin].path);
				} catch(e) {
					console.error(e);
				}
			}

			if (options.hasOwnProperty('polarity')) {
				try {
					execSync('./pwmControl.sh set_polarity ' + options.polarity + ' ' + pwm[pin].path);
				} catch(e) {
					console.error(e);
				}
			}
		}
	}
}

module.exports = {
	enable: enable,
	disable: disable,
	get: get,
	set: set
};
