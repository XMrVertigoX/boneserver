/*
 * settings.js - This module controls the settings files. First the defaults
 * are loaded and then overwritten by the custom settings provided in
 * settings.json if the files exists
 */

var fs = require('fs');

// loads the default settings
var settingsDefault = require('./settings-default.json');

// generate a empty object
var settings = {};

/* 
 * Overwrites default settings if custom ones exists
 */
if (fs.existsSync('./settings.json')) {
	// deep copy of the default settings
	settings = JSON.parse(JSON.stringify(settingsDefault));

	// read and parse the settings.json
    var temp = JSON.parse(fs.readFileSync('./settings.json'));
    
    for (key in temp) {
        settings[key] = temp[key];
    }
}

/*
 * returns the requestet value if existing else nothing
 */
var get = function(parameter) {
	if (settings.hasOwnProperty(parameter)) {
		return settings[parameter];
	}
}

module.exports = {
	get: get
}