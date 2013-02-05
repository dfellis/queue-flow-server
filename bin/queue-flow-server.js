var fs = require('fs');
var commander = require('commander');
var deepmerge = require('deepmerge');
var qfserver = require('../lib/server');

// Parse command-line options
commander
    .version('0.0.1')
    .option('-c, --config <conffile>', 'Specifies the config file for the server')
    .parse(process.argv);

// Define the default config
var config = {
    transports: {},
    isMaster: true,
    processes: 4, // Ignored for now
    stats: {
        enabled: true
    },
    modules: {
        parallel: 'parallel-queue-flow',
        sloppy: 'sloppy-queue-flow',
        l: 'lambda-js'
    }
};

// Override the defaults if an alternate config file is specified
if(commander.config) {
    try {
        var newConfig = JSON.parse(fs.readFileSync(commander.config, 'utf8'));
        config = deepmerge(config, newConfig);
    } catch(e) {
        console.err('Could not read the config file. ' + e.message);
        process.exit(-1);
    }
}

// Add the REST interface if none was specified
if(Object.keys(config.transports).length === 0) config.transports.rest = 11235;

// Start the server
qfserver(config);
