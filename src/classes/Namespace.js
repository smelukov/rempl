var hasOwnProperty = Object.prototype.hasOwnProperty;

var Namespace = function(name, owner) {
    this.name = name;
    this.owner = owner;
    this.methods = Object.create(null);
};

Namespace.prototype = {
    isMethodProvided: function(methodName) {
        return hasOwnProperty.call(this.methods, methodName);
    },
    provide: function(methodName, fn) {
        if (typeof methodName === 'string') {
            if (typeof fn === 'function') {
                this.methods[methodName] = fn;
            }
        } else {
            var methods = methodName;
            for (methodName in methods) {
                if (hasOwnProperty.call(methods, methodName) &&
                    typeof methods[methodName] === 'function') {
                    this.methods[methodName] = methods[methodName];
                }
            }
        }
    },
    revoke: function(methodName) {
        if (Array.isArray(methodName)) {
            methodName.forEach(this.revoke, this);
        } else {
            if (hasOwnProperty.call(this.methods, methodName)) {
                delete this.methods[methodName];
            }
        }
    },
    callRemote: function(method/*, ...args, callback*/) {
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = null;

        if (args.length && typeof args[args.length - 1] === 'function') {
            callback = args.pop();
        }

        Namespace.send(this.owner, [{
            type: 'call',
            ns: this.name,
            method: method,
            args: args
        }, callback]);
    }
};

Namespace.invoke = function invoke(namespace, method, args, callback) {
    // add a callback to args even if no callback, to avoid extra checking
    // that callback is passed by remote side
    args = args.concat(typeof callback === 'function' ? callback : function() {});

    // invoke the provided remote method
    namespace.methods[method].apply(null, args);
};

Namespace.send = function send(owner, args) {
    for (var channel in owner.channels) {
        if (typeof owner.channels[channel] === 'function') {
            owner.channels[channel].apply(null, args);
        }
    }
};

module.exports = Namespace;
