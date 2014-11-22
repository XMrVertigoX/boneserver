/*
 * websocket.js - manages the websocket connection.
 */

var connected = false;
var websocket;

/*
 * sets a connection status variable
 *
 * returns nothing
 */
exports.setConnected = function(state) {
    if (typeof state == 'boolean') {
        connected = state;
    }
}

/*
 * Sets the websocket object
 *
 * returns nothing
 */
exports.setSocket = function(socket) {
    websocket = socket;
}

/*
 * stringifies and writes a JSON-object to the websocket, no error correction.
 *
 * returns nothing
 */
exports.write = function(data) {
    if (connected) {
        websocket.send(JSON.stringify(data), function(err) {
            if (err != undefined) {
                console.log(err.stack);
            }
        });
    }
}