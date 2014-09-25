var execSync = require('exec-sync');
var cp = require('child_process');

var bone_capemgr = execSync('find /sys/devices/ -name bone_capemgr.*');
var ocp = execSync('find /sys/devices/ -name ocp.*');

var pwmPrefix = 'bone_pwm_';
var slotsPath = bone_capemgr + '/slots';

exports.enablePWM = function (pin) {
	var command = 'echo ' + pwmPrefix + pin + ' > ' + slotsPath;
	execSync(command);
}

exports.disablePWM = function (pin) {
	var command = 'cat ' + slotsPath;
	var lines = execSync(command).split('\n');

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i].match(pwmPrefix + pin);

		if (line != null) {
			var slotIndex = lines[i].split(':')[0];
			var innerCommand = 'echo ' + slotIndex + ' > ' + slotsPath;

			//execSync(innerCommand);
		}
	}
}

exports.setDuty = function (pin, duty) {

}

exports.setFrequency = function (pin, frequency) {

}
