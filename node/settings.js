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
}