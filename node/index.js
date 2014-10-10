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
var settings = require('./settings.json');
var timer = require('./timer.js')
var websocket = require('./websocket.js');

// Initialize Web Socket server
var boneserver = new wss({'host': settings.host, 'port': settings.port});

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
