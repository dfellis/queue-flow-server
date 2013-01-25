# queue-flow-server

Massive data processing made easy!

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
queue-flow-server -p 11235 -c custom_config.json
```

RESTful interface:

/ - single-page web interface for stats & dynamic configuration

/queue/<foo> - a queue-flow queue (listing of stats about queue if pulled up this way?)

/create - RESTful interface for defining a new queue (or queues). Expects raw JS code. This code may define other queues accessible from the server.

/close/<foo> - RESTful interface for closing the queue. Stops accepting new data, finishes processing old.

/kill/<foo> - RESTful interface for killing the queue. Immediate halt of activity.

/push/<foo> - RESTful interface for pushing data onto the queue. If given an array it assumes a bulk push (if you want to push an array wrap it in an array: [[1, 2, 3, 4, 5]] If given a queue name that doesn't exist, it auto-create it.

/pull/<foo> - RESTful interface for pulling data off of a queue. (Need to alter queue-flow to allow this.) Useful for treating queue-flow-server as a pure queue (or a queue-process-requeue stack)

/on/<foo>/(push|pull|empty|close|kill) - RESTful interface for registering a new event handler. Must be a JS function. (Can be registered during create, too.)

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
