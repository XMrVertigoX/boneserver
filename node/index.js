/*
 * BoneServer - A bonescript Web Socket API
 * 
 * © bonescript by Jason Kridner <jdk@ti.com>
 * © boneserver by Caspar Friedrich <caspar.friedrich@koeln.de>
 */

var wss = require('ws').Server;

var bonecontrol = require('./bonecontrol.js');
var bonescript = require('bonescript');
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
        console.log("interface disconnected");
    });

    socket.on('message', function(request) {
        response = JSON.parse(request);
        response.response = bonecontrol.handleRequest(response);

        if (response.hasOwnProperty('parameters')) {
            response.timer = timer.isRunning(response.parameters.pin);
        };

        websocket.write(response);
    });
});

bonescript.getPlatform(function(platform) {
    console.log(platform.name + " running bonescript " + platform.bonescript);
});