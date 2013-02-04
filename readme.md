# queue-flow-server

Massive data processing made easy!

# Goals

queue-flow-server is not yet functional, all sections below the goals section are currently exploration on what the interface should be like. An outline of the goals for the project follows.

1. Create a "baby map-reduce" system that is easier to use than Hadoop, though slower than such a compiled system.
2. Be more *flexible* than Hadoop, allowing all of queue-flow's functional style to be used, rather than a fixed 1-2 of map then reduce and nothing else. If I want to filter-map-filter-reduce, let me!
3. Develop a cluster-queue-flow constructor function tied to queue-flow-server that allows the queue processing to spread across multiple cores.
4. Expand over time to allow master and slave queue-flow-servers so the clustering can spread across multiple machines (will need an algorithm to balance expected CPU time versus cross-server bandwidth available to decide how much should be spread to where)
5. Provide a nice web interface for tracking statistics (how much data has been processed, what rate its going, where the bottleneck in the flow seems to be, etc.
6. Maybe add an authentication layer in the future? Right now it's assumed that a firewall will be wrapped around it and only privileged apps will be able to communicate with it.

# Install

## Setting up a server

    sudo npm install -g queue-flow-server
    queue-flow-server [options]

## For a client app

    npm install queue-flow-server # var qfclient = require('queue-flow-server').client;

# Usage

(Just exploratory usage right now. What I envision queue-flow-server to do, not what it actually does.)

queue-flow-server is **NOT** intended to be a publicly-facing server, at least at first. Will do whatever its told, will own (or pwn) box it resides on.

```sh
queue-flow-server -c custom_config.json
```

RESTful interface:

/ - single-page web interface for stats & dynamic configuration

/queue/[foo] - a queue-flow queue (listing of stats about queue if pulled up this way?)

/create - RESTful interface for defining a new queue (or queues). Expects raw JS code. This code may define other queues accessible from the server.

/close/[foo] - RESTful interface for closing the queue. Stops accepting new data, finishes processing old.

/kill/[foo] - RESTful interface for killing the queue. Immediate halt of activity.

/push/[foo] - RESTful interface for pushing data onto the queue. If given an array it assumes a bulk push (if you want to push an array wrap it in an array: [[1, 2, 3, 4, 5]] If given a queue name that doesn't exist, it auto-create it.

/pull/[foo] - RESTful interface for pulling data off of a queue. (Need to alter queue-flow to allow this.) Useful for treating queue-flow-server as a pure queue (or a queue-process-requeue stack)

/on/[foo]/(push|pull|empty|close|kill) - RESTful interface for registering a new event handler. Must be a JS function. (Can be registered during create, too.)

/exists/[foo] - Specifies whether or not the queue exists on the server.

JSON-RPC interface:

Mirror the above, returning JSON objects instead of HTML.

stats() -> /'s stats above

config(updateObj) -> /'s config above; if updateObj is undefined, return the current config, otherwise set the specified config properties as defined in the object (updating, not replacing, so only the config you're interested in needs specifying).

create(sourceCode) -> /create above with the raw source code string provided.

close(queue) -> /close/[foo] above, where queue is the queue name.

kill(queue) -> /kill/[foo] above.

push(queue, arrayToEnqueue) -> /push/[foo] above. If arrayToEnqueue isn't an array, it enqueues a single item.

pull(queue) -> /pull/[foo] above. Returns the oldest entry on the queue. Shouldn't run this on any queue with a handler.

on(event, queue, sourceCode) -> /on/[foo]/(push|pull|empty|close|kill) above. Creates an event handler for the specified queue and event.

exists(queue) -> /exists/[foo] above. Simply returns a boolean true/false. Useful for code to see if the desired queue has already been created on the server or not.

Probably use [multitransport-jsonrpc](https://github.com/dfellis/multitransport-jsonrpc) once it's stabilized so processes that are pushing data constantly into the server and pulling results out to keep a steady TCP connection (using the TCP transport instead of the HTTP transport).

# License (MIT)

Copyright (C) 2013 by David Ellis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
