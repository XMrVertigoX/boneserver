/*
 * BoneServer - A bonescript Web Socket API
 * 
 * © bonescript by Jason Kridner <jdk@ti.com>
 * © boneserver by Caspar Friedrich <caspar.friedrich@koeln.de>
 */

// Global modules
var fs = require('fs');

// Lokal modules
var wss = require('ws').Server;
var bonescript = require('bonescript');

// Own modules
var boneControl = require('./boneControl.js');
var interface = require('./interfaceControl.js');
<<<<<<< HEAD
var settings = require('./settings.js');
=======
var settings = require('./settings-default.json');
>>>>>>> dcedeffae1d3672b8cacc74b33d5778fb8fc525e
var timer = require('./timer.js')
var websocket = require('./websocket.js');

// Overwrites default settings if custom ones existing. Overwrites only settings provided in settings-default.json
<<<<<<< HEAD
// if (fs.existsSync('./settings.json')) {
//     var temp = JSON.parse(fs.readFileSync('./settings.json'));
    
//     for (key in temp) {
//         if (settings.hasOwnProperty(key)) {
//             settings[key] = temp[key];
//         }
//     }
// }

// Initialize WebSocket server
var boneserver = new wss({'host': settings.get('host'), 'port': settings.get('port')});
=======
if (fs.existsSync('./settings.json')) {
    var temp = JSON.parse(fs.readFileSync('./settings.json'));
    
    for (key in temp) {
        if (settings.hasOwnProperty(key)) {
            settings[key] = temp[key];
        }
    }
}

// Initialize WebSocket server
var boneserver = new wss({'host': settings.host, 'port': settings.port});
>>>>>>> dcedeffae1d3672b8cacc74b33d5778fb8fc525e

boneserver.on('connection', function(socket) {
    websocket.setSocket(socket);
    websocket.setConnected(true);
    
    console.log("interface connected");

    socket.on('close', function() {
        websocket.setConnected(false);
        interface.saveToFile();
        console.log("interface disconnected");
    });

    socket.on('message', function(request) {
        response = JSON.parse(request);
        response.response = boneControl.handleRequest(response);

        if (response.hasOwnProperty('parameters')) {
            response.timer = timer.isRunning(response.parameters.pin);
        };

        websocket.write(response);
    });
});

bonescript.getPlatform(function(platform) {
    console.log(platform.name + " running bonescript " + platform.bonescript);
});
