/*
 * websocketCtrl.js - Controller script to manage things according to the
 * websocket connection.
 */

var websocketCtrl = {};

/*
 * Detects if a ssl connection and starts the websocket connection
 */
websocketCtrl.connect = function() {
    if (location.protocol === 'https:') {
        websocket = new WebSocket('wss://' + location.host);
    } else {
        websocket = new WebSocket('ws://' + location.host);
    }

    websocket.onclose = function() {
        console.log("WebSocket disconnected");

        util.replaceClass($('#headerConnectionGlyphicon'), 'glyphicon-ok', 'glyphicon-remove');
        util.replaceClass($('#headerConnectionButton'), 'btn-success', 'btn-danger');        
    }

    websocket.onmessage = function(message) {
        message = JSON.parse(message.data);
		responseHandler[message.type](message);
    }

    websocket.onopen = function() {
        console.log("WebSocket connected (" + websocket.url + ")");

        util.replaceClass($('#headerConnectionGlyphicon'), 'glyphicon-remove', 'glyphicon-ok');
        util.replaceClass($('#headerConnectionButton'), 'btn-danger', 'btn-success');
        
        bonescriptCtrl.getPins();
    }
}
