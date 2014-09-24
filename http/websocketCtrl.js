var websocketCtrl = {};

websocketCtrl.connect = function() {
    if (location.protocol === 'https:') {
        websocket = new WebSocket('wss://' + location.host + ':8081');
    } else {
        websocket = new WebSocket('ws://' + location.host + ':8081');
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
        console.log("WebSocket connected (" + websocket.URL + ")");

        util.replaceClass($('#headerConnectionGlyphicon'), 'glyphicon-remove', 'glyphicon-ok');
        util.replaceClass($('#headerConnectionButton'), 'btn-danger', 'btn-success');
        
        bonescriptCtrl.getPins();
    }
}
