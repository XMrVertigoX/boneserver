var shelljs = require('shelljs');

var slots = shelljs.ls('/sys/devices/bone_capemgr.*')[0] + '/slots';

// Enable PWM functionality
if (shelljs.cat(slots).match('am33xx_pwm') == null) {
	'am33xx_pwm'.to(slots);
}

var ocp = shelljs.ls('/sys/devices/ocp.*')[0];

var pinPattern = /P[8|9]_[1-4][0-9]/i;
var pwmDirectoryPrefix = 'pwm_test_';
var pwmSlotPrefix = 'bone_pwm_';

var disable = function(pin) {
	var tmpSlots = readSlots();

	if (tmpSlots.hasOwnProperty(pin)) {
		('-' + tmpSlots[pin]).to(slots);
	}
} 

var enable = function(pin) {
	var tmpSlots = readSlots();

	if (!tmpSlots.hasOwnProperty(pin)) {
		(pwmSlotPrefix + pin).to(slots);
	}
}

var read = function(pin) {
	var directory = pwmDirectory(pin);
	var data = {};

	if (directory !== undefined) {
		data['path'] = directory;

		var files = shelljs.ls(directory);

		for (var i = 0; i < files.length; i++) {
			if (files[i].match(/duty|period|polarity|run/)) {
				data[files[i]] = parseInt(shelljs.cat(directory + '/' + files[i]));
			}
		};
	};

	return data;
}

var pwmDirectory = function(pin) {
	return shelljs.ls(ocp + '/' + pwmDirectoryPrefix + pin + '.*')[0];
}

var readSlots = function() {
	var lines = shelljs.grep(pwmSlotPrefix, slots).split('\n');
	var pwmlist = {};

	for (var i = 0; i < lines.length; i++) {
		var pin = lines[i].match(pinPattern);
		if (pin != null) {
			pwmlist[pin] = parseInt(lines[i].split(':')[0]);
		}
	};

	return pwmlist;
}

var write = function(pin, options) {
	var pwmlist = readSlots();
	
	if (pwmlist.hasOwnProperty(pin)) {
		var pwm = read(pin);
	
		if (options.hasOwnProperty('frequency')) {
			// convert frequency to period in ns
			var period_ns = (1/options.frequency) * Math.pow(10, 9);

			if (options.hasOwnProperty('duty')) {
				var duty_ns = period_ns * options.duty;
			} else {
				var duty_ns = (pwm.duty/pwm.period) * period_ns;
			}

			String(0).to(pwm.path + '/duty');
			String(period_ns).to(pwm.path + '/period');
			String(duty_ns).to(pwm.path + '/duty');
		} else if (options.hasOwnProperty('duty')) {
			var duty_ns = pwm.period * options.duty;

			String(duty_ns).to(pwm.path + '/duty');
		}

		if (options.hasOwnProperty('run')) {
			String(options.run).to(pwm.path + '/run');
		}

		if (options.hasOwnProperty('polarity')) {
			String(options.polarity).to(pwm.path + '/polarity');
		}
	}
}

module.exports = {
	disable: disable,
	enable: enable,
	read: read,
	write: write
};
