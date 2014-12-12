/*
 * gpioControl - Module to manage digital io via file system.
 */

// For writing directly to system files
var shelljs = require('shelljs');

// GPIO system path
var gpioPath = '/sys/class/gpio/';

/*
 * Disables a GPIO. Checks if GPIO is enabled and if not writes its ID to the
 * unexport system file
 * 
 * eturns true if gpio has been successfully disabled
 */
var disable = function(gpio) {
	if (isEnabled(gpio)) {
		String(gpio).to(gpioPath + 'unexport');
	}

	return !isEnabled(gpio);
}

/*
 * Enables a GPIO. Checks if GPIO is not enabled and if not writes its ID to
 * the export system file.
 *
 * returns true if gpio has been successfully enabled
 */
var enable = function(gpio) {
	if (!isEnabled(gpio)) {
		String(gpio).to(gpioPath + 'export');
	}

	return isEnabled(gpio);
}

/*
 * Reads the GPIO files.
 * 
 * returns the strings from the files in a JSON onject.
 */
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

/*
 * Writes new parameters to the GPIO files.
 *
 * returns the new GPIO status
 */
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

		// if (options.hasOwnProperty('pulldown')) {
		// 	if (options.pulldown) {
		// 		String(1).to(gpioFolder + 'active_low');
		// 	} else {
		// 		String(0).to(gpioFolder + 'active_low');
		// 	}
		// }

		String(1).to(gpioFolder + 'active_low');
	}

	return read(gpio);
}

var isEnabled = function(gpio) {
	return shelljs.test('-e', gpioPath + 'gpio' + gpio);
}

module.exports = {
	disable: disable,
	enable: enable,
	read: read,
	write: write
}
