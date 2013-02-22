var q = require('queue-flow');
var l = require('lambda-js');
var jsonrpc = require('multitransport-jsonrpc');
var RpcClient = jsonrpc.client;
var ClientTcp = jsonrpc.transports.client.tcp;
var ClientHttp = jsonrpc.transports.client.http;
var http = require('http');

// Make queries on a RESTful interface
function rest(host, port, method, path, obj, callback) {
    var req = http.request({
        host: host,
        port: port,
        method: method,
        path: path
    }, function(res) {
        res.setEncoding('utf8');
        var r = q.ns()().reduce(l('cum, cur', 'cum + cur'), function(result) {
            var json;
            try {
                json = JSON.parse(result);
            } catch(e) {
                callback(new Error("Remote server doesn't appear to be a queue-flow-server: " + e.message));
            }
            callback(null, json);
        });
        res.on('data', r.push.bind(r));
        res.on('end', r.close.bind(r));
    });

    if(method === 'POST' && !!obj) {
        var json;
        try {
            json = JSON.stringify(obj);
        } catch(e) {
            throw new Error("Provided object cannot be converted to JSON: " + e.message);
        }
        req.write(json);
    }

    req.end();
}

// Create a JSON-RPC HTTP client
function rpcHttp(host, port) {
    return new RpcClient(new ClientHttp(host, port));
}

// Create a JSON-RPC TCP client
function rpcTcp(host, port, config) {
    var tcpConfig = {};
    if(config.retries) tcpConfig.retries = config.retries;
    if(config.retryInterval) tcpConfig.retryInterval = config.retryInterval;
    return new RpcClient(new ClientTcp(host, port, tcpConfig));
}

// Make the RESTful interface look approximately like the JSON-RPC client's request method signature
function restWrapper(host, port, method, args, callback) {
    if(method === 'stats' && !!args[0]) {
        rest(host, port, 'GET', '/' + method, null, callback);
    } else if(method === 'stats' || method === 'close' || method === 'kill' || method === 'pull' || method == 'exists') {
        rest(host, port, 'GET', '/' + method + '/' + args[0], null, callback);
    } else if(method === 'config' || method === 'create') {
        rest(host, port, 'POST', '/' + method, args[0], callback);
    } else if(method === 'push') {
        rest(host, port, 'POST', '/' + method + '/' + args[0], args[1], callback);
    } else if(method === 'on') {
        rest(host, port, 'POST', '/' + method + '/' + args[1] + '/' + args[0], args[2], callback);
    }
}

function QueueRef(queueName, host, port, config) {

}

QueueRef.prototype.stats = function queueStats(callback) {

};

QueueRef.prototype.close = function close(callback) {

};

QueueRef.prototype.kill = function kill(callback) {

};

QueueRef.prototype.push = function push() {

};

QueueRef.prototype.pull = function pull(callback) {

};

QueueRef.prototype.on = function on(event, handlerFunc, callback) {

};

function clientCreate(host, port, config) {
    function client(queue) {
       return new QueueRef(queue, host, port, config); 
    }

    client.stats = function clientStats(callback) {

    };

    client.config = function config(updateObj, callback) {

    };

    client.create = function create(queueFunc, callback) {

    };

    client.exists = function exists(queue, callback) {

    };

    return client;
}

module.exports = clientCreate;
