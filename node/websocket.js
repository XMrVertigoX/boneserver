/*
 * websocket.js - manages the websocket connection.
 */

//var connected = false;
var socket;

/*
 * sets a connection status variable
 *
 * returns nothing
 */
// exports.setConnected = function(state) {
//     if (typeof state == 'boolean') {
//         connected = state;
//     }
// }

/*
 * Sets the websocket object
 *
 * returns nothing
 */
function set(data) {
    socket = data;
}

/*
 * stringifies and writes a JSON-object to the websocket, no error correction.
 *
 * returns nothing
 */
function write(data) {
    if (socket["_socket"].writable) {
        socket.send(JSON.stringify(data), function(err) {
            if (err != undefined) {
                console.log(err.stack);
            }
        });
    }
}

module.exports = {
    set: set,
    write: write
}