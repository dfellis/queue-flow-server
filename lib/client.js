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
