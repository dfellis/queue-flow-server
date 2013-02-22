var http = require('http');
var fs = require('fs');
var npm = require('npm');
var jsonrpc = require('multitransport-jsonrpc');
var q = require('queue-flow');
var version = JSON.parse(fs.readFileSync('../package.json')).version;

var cache = {};
function loadFromCache(path, mode) {
    if(cache[path]) return cache[path];
    mode = mode || 'utf8';
    cache[path] = fs.readFileSync(path, mode);
}

function staticFile(res, config) {
    res.writeHead(config.statusCode, config.statusText, config.headers);
    res.end(loadFromCache(config.path, config.mode), config.mode);
}

function updateServer(res, configString) {

}

function buildQueueEnv(res, qDefinition) {
    // TODO: Flesh this out
}

function updateQueue(res, queueName, qConfigString) {

}

function defaultHeaders() {
    return {
        'Content-Type': 'text/html',
        'Expires': new Date(new Date.getTime() + 24*60*60*1000).toDateString(),
        'X-Powered-By': 'queue-flow-server/' + version
    };
}

function parsePost(req, next) {
    var r = q.ns()().reduce(function assemblePostString(cum, cur) {
        return cum + cur;
    }, next, '');
    req.on('data', r.push.bind(r));
    req.on('end', r.close.bind(r));
}

function pullHandler(res, queueName) {

}

function pushHandler(res, queueName, jsonString) {

}

function closeHandler(res, queueName) {

}

function killHandler(res, queueName) {

}

function registerHandler(res, queueName, handlerName, handlerDefinition) {

}

function updateQueue(res, queueName, jsonString) {

}

function startRestServer(config) {
    var restServer = http.createServer(function qfserverHandler(req, res) {
        if (req.url === '/') {
            if (req.method === 'GET') {
                staticFile(res, {
                    statusCode: 200,
                    statusText: 'OK',
                    headers: defaultHeaders(),
                    path: '../assets/html/index.html',
                    mode: 'utf8'
                });
            } else {
                parsePost(req, updateConfig.bind(this, res));
            }
        } else if (req.url === '/create') {
            parsePost(req, buildQueueEnv.bind(this, res));
        } else if (/^\/push\/([^\/]*)$/.test(req.url)) {
            parsePost(req, pushHandler.bind(this, res, RegExp.$1));
        } else if (/^\/pull\/([^\/]*)$/.test(req.url)) {
            pullHandler(res, RegExp.$1);
        } else if (/^\/close\/([^\/]*)$/.test(req.url)) {
            closeQueue(res, RegExp.$1);
        } else if (/^\/kill\/([^\/]*)$/.test(req.url)) {
            killQueue(res, RegExp.$1);
        } else if (/^\/on\/([^\/]*)\/([^\/])*$/.test(req.url)) {
            parsePost(req, registerHandler.bind(this, res, RegExp.$1, RegExp.$2));
        } else if (/^\/queue\/([^\/]*)$/.test(req.url)) {
            if (req.method === 'GET') {
                staticFile(res, {
                    statusCode: 200,
                    statusText: 'OK',
                    headers: defaultHeaders(),
                    path: '../assets/html/queue.html',
                    mode: 'utf8'
                });
            } else {
                parsePost(req, updateQueue.bind(this, res, RegExp.$1));
            }
        } else {
            var headers = defaultHeaders();
            var mode = 'utf8';
            if (/js$/.test(req.url)) {
                headers['Content-Type'] = 'application/javascript';
            } else if (/css$/.test(req.url)) {
                headers['Content-Type'] = 'text/css';
            } else if (/png$/.test(req.url)) {
                headers['Content-Type'] = 'image/png';
                mode = undefined;
            } else if (/svg$/.test(req.url)) {
                headers['Content-Type'] = 'image/svg+xml';
            } else {
                headers['Content-Type'] = 'application/octet-stream';
                mode = undefined;
            }
            staticFile(res, {
                statusCode: 200,
                statusText: 'OK',
                headers: headers,
                path: '../assets' + req.url,
                mode: mode
            });
        }
    });
    restServer.listen(config.transports.rest);
    return restServer;
}

module.exports = function qfServer(config) {
    var r = q.ns();
    r('install')
        .node(npm.load.bind(npm), 'loadError')
        .map(function(data) {
            return Object.keys(config.modules)
                .map(function(key) { return config.modules[key]; });
        })
        .node(npm.commands.install.bind(npm.commands), 'installError')
        .map(function(data) {
            return q.tuple(config.modules);
        })
        .flatten(1)
        .map(function(lib) {
            global[lib[0]] = require(lib[1].replace(/@.*$/, ''));
            return;
        })
        .reduce(function() {})
        .branch('afterinstall');
    r('afterinstall')
        .map(function(data) {
            return Object.keys(config.transports);
        })
        .flatten()
        .branch(function(transport) {
            return transport;
        });
    r('rest')
        .each(function(data) {
            startRestServer(config);
        });
    r('jsonRpc').branch('jsonRpcHttp');
    r('jsonRpcHttp')
        .each(function(data) {
            startJsonRpcServer(config, 'http');
        });
    r('jsonRpcTcp')
        .each(function(data) {
            startJsonRpcServer(config, 'tcp');
        });
    r('loadError')
        .each(function(errResVal) {
            console.err('Cannot load NPM ' + errResVal[0].message);
            process.exit(-2);
        });
    r('installError')
        .each(function(errResVal) {
            console.err('Cannot install specified modules ' + errResVal[0].message);
            process.exit(-3);
        });
};
