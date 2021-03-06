module.exports = function createSync(publisher) {
    var syncBrowserExtension = require('./sync-browser-extension.js');
    // var inpageSync = require('./sync-in-page.js');
    var syncWs = require('./sync-ws.js');
    // var remoteSubscribers = new Token(0);
    // var devtools = new Token(false);

    // browser extension
    syncBrowserExtension(publisher, function(api) {
        api.subscribe(publisher.processInput);
        api.connected.link(function(connected) {
            // devtools.set(connected);
            publisher.channels.browserExtension = connected ? api.send : null;
        });
    });

    // in page
    // inpageSync(publisher, function(api) {
    //     api.subscribe(publisher.processInput);
    //     api.connected.link(function(connected) {
    //         // devtools.set(connected);
    //         publisher.channels.inPage = connected ? api.send : null;
    //     });
    // });

    // ws server
    syncWs(publisher, function(api) {
        api.subscribe(publisher.processInput);
        api.connected.link(function(connected) {
            // remoteSubscribers.set(connected);
            publisher.channels.wsserver = connected ? api.send : null;
        });
    });

    // publisher.remoteSubscribers = remoteSubscribers;   // TODO: remove
    // publisher.devtools = devtools;                 // TODO: remove

    return publisher;
};
