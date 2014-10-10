/* Module for building the interface config */

var fs = require('fs');

var whitelist = require('./whitelist.json');

var config = {};

var get = function(pin, parameter) {
	if (config.hasOwnProperty(pin)) {
		if (config[pin].hasOwnProperty(parameter)) {
			return config[pin][parameter];
		}
	}
}

var set = function(pin, parameter, value) {
	if (config.hasOwnProperty(pin)) {
		if (config[pin].hasOwnProperty(parameter)) {
			config[pin][parameter] = value;
		}
	}
}

var readFromFile = function() {
	if (fs.existsSync('./interface.json')) {
		config = JSON.parse(fs.readFileSync('interface.json'));
	}

	for (pin in whitelist) {
		if (!config.hasOwnProperty(pin)) {
			config[pin] = whitelist[pin];
		}
	}
}

var saveToFile = function() {
	fs.writeFileSync('./interface.json', JSON.stringify(config));
}

readFromFile();

module.exports = {
	config: config,
	get: get,
	set: set,
	readFromFile: readFromFile,
	saveToFile: saveToFile
};
