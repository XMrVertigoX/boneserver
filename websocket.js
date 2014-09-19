var connected = false;
var websocket;

exports.setConnected = function(state) {
    if (typeof state == 'boolean') {
        connected = state;
    }
}

exports.setSocket = function(socket) {
    websocket = socket;
}

exports.write = function(data) {
    if (connected) {
        websocket.send(JSON.stringify(data), function(err) {
            if (err != undefined) {
                console.log(err.stack);
            }
        });
    }
}
