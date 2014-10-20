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
}