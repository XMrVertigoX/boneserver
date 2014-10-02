var shelljs = require('shelljs');

var gpioPath = '/sys/class/gpio/';

var disable = function(gpio) {
	if (isEnabled(gpio)) {
		String(gpio).to(gpioPath + 'unexport');
	}
}

var enable = function(gpio) {
	if (!isEnabled(gpio)) {
		String(gpio).to(gpioPath + 'export');
	}
}

var isEnabled = function(gpio) {
	return shelljs.test('-e', gpioPath + 'gpio' + gpio);
}

var read = function(gpio) {
	var content = {};

	if (isEnabled(gpio)) {
		var gpioFolder = gpioPath + 'gpio' + gpio + '/';
		var files = shelljs.ls(gpioFolder);

		for (var i = 0; i < files.length; i++) {
			if (shelljs.test('-f', gpioFolder + files[i])) {
				content[files[i]] = shelljs.cat(gpioFolder + files[i]).split('\n')[0];
			}
		}
	}

	return content;
}

var write = function(gpio, options) {
	if (!isEnabled(gpio)) {
		enable(gpio);
	} 

	if (isEnabled(gpio)) {
		var gpioFolder = gpioPath + 'gpio' + gpio + '/';

		if (options.hasOwnProperty('direction')) {
			String(options.direction).to(gpioFolder + 'direction');
		}

		if (options.hasOwnProperty('value')) {
			if (read(gpio).direction == 'out') {
				String(options.value).to(gpioFolder + 'value');
			}
		}
	}
}

module.exports = {
	disable: disable,
	enable: enable,
	read: read,
	write: write
};
