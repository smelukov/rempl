var fs = require('fs');
var path = require('path');
var WsTransport = require('../../transport/ws.js');
var CLIENT_ID_FILENAME = '.rempl_endpoint_id'; // FIXME: dirty solution

function NodeWsTransport() {
    this.pid = process.pid;
    this.title = process.title;

    WsTransport.apply(this, arguments);

    // TODO make it through temp file
    if (fs.existsSync(path.resolve(CLIENT_ID_FILENAME))) {
        this.id = fs.readFileSync(path.resolve(CLIENT_ID_FILENAME), 'utf-8');
    }
}

NodeWsTransport.create = WsTransport.create;
NodeWsTransport.prototype = Object.create(WsTransport.prototype);

NodeWsTransport.prototype.setClientId = function(id) {
    WsTransport.prototype.setClientId.call(this, id);
    fs.writeFileSync(CLIENT_ID_FILENAME, this.id);
};

NodeWsTransport.prototype.type = 'node';
NodeWsTransport.prototype.infoFields = WsTransport.prototype.infoFields.concat(
    'pid',
    'title'
);

module.exports = NodeWsTransport;
