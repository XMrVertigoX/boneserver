/*
 * interfaceControl.js - Read an write interface config files
 */

var fs = require('fs');

// read the static pin whitelist 
var whitelist = require('./whitelist.json');

var config = {};

/*
 * read config parameters
 *
 * returns the parameter value otherwise undefined
 */
var get = function(pin, parameter) {
    if (config.hasOwnProperty(pin)) {
        if (config[pin].hasOwnProperty(parameter)) {
            return config[pin][parameter];
        }
    }
}

/*
 * write a parameter to the interface object. overwrites only existing parameters.
 */
var set = function(pin, parameter, value) {
    if (config.hasOwnProperty(pin)) {
        if (config[pin].hasOwnProperty(parameter)) {
            config[pin][parameter] = value;
        }
    }
}

/*
 * read the interface config files. copies config data from whitelist or from
 * interface.json if existing
 */
// var readFromFile = function() {
//     if (fs.existsSync('./interface.json')) {
//         config = JSON.parse(fs.readFileSync('interface.json'));
//     }

//     for (pin in whitelist) {
//         if (!config.hasOwnProperty(pin)) {
//             config[pin] = whitelist[pin];
//         }
//     }
// }

var readFromFile = function() {
    for (pin in whitelist) {
        if (whitelist[pin].available) {
            config[pin] = whitelist[pin];
        }
    }

    if (fs.existsSync('./interface.json')) {
        temp = JSON.parse(fs.readFileSync('interface.json'));

        for (pin in temp) {
            if (config.hasOwnProperty(pin)) {
                config[pin] = temp[pin];
            };
        }
    }
}

/*
 * write the interface object. overwrite existing one
 */
var saveToFile = function() {
    fs.writeFileSync('./interface.json', JSON.stringify(config));
}

// read config files
readFromFile();

module.exports = {
    config: config,
    get: get,
    set: set,
    readFromFile: readFromFile,
    saveToFile: saveToFile
};
