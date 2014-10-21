<<<<<<< HEAD
/* This module controls the settings files. First the defaults are loaded and then overwritten by the custom one provided in settings.json if the files exists */

var fs = require('fs')
var settingsDefault = require('./settings-default.json')
var settings = {}

// Overwrites default settings if custom ones exists
if (fs.existsSync('./settings.json')) {
	// Depp copy of the default settings
	settings = JSON.parse(JSON.stringify(settingsDefault));
    var temp = JSON.parse(fs.readFileSync('./settings.json'));
    
    for (key in temp) {
        settings[key] = temp[key];
    }
}

var get = function(parameter) {
	if (settings.hasOwnProperty(parameter)) {
		return settings[parameter];
	}
}

module.exports = {
	get: get
=======
var fs = require('fs')
var settings = require('./settings-default.json')

/* This module controls the settings files. First the defaults are loaded and then overwritten by the custom one privided in settings.json if the files exists */

// Overwrites default settings if custom ones existing. Overwrites only settings provided in settings-default.json
if (fs.existsSync('./settings.json')) {
    var temp = JSON.parse(fs.readFileSync('./settings.json'));
    
    for (key in temp) {
        if (settings.hasOwnProperty(key)) {
            settings[key] = temp[key];
        }
    }
}

module.exports = {
	settings: settings
>>>>>>> dcedeffae1d3672b8cacc74b33d5778fb8fc525e
}