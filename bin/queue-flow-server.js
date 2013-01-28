var fs = require('fs');
var commander = require('commander');
var qfserver = require('../lib/server');

// Parse command-line options
commander
    .version('0.0.1')
    .option('-c, --config <conffile>', 'Specifies the config file for the server')
    .parse(process.argv);

// Define the default config
var config = {
    port: 11235 
};

// Override the defaults if an alternate config file is specified
if(commander.config) {
    var newConfig = fs.readFileSync(commander.config, 'utf8');
    for(var key in newConfig) {
        config[key] = newConfig[key];
    }
}

// Start the server
qfserver(config);
