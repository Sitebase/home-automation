require('colors');
var stdio = require('stdio');
var logger = require('./lib/logger');
var _ = require('lodash');
var sandbox = require('./lib/sandbox');

var ops = stdio.getopt({
    'modules': {key: 'm', args: 1, mandatory: false, description: 'What this option means'},
    'environment': {key: 'e', args: 1, mandatory: false, description: 'Environment'},
});

// Make array of modules option
ops.modules = ops.modules ? ops.modules.split(',') : ['webapp'];

logger.debug('Start modules');

// Load config
var environment = ops.environment || 'production';
var config = require('./config/' + environment + '.json');

// Add vars to sandbox
sandbox.environment = environment;
sandbox.config = config;

if( _.contains(ops.modules, 'webapp') )
	var webapp = new require('./modules/webapp')(sandbox, {});

if( _.contains(ops.modules, 'beckhoff') )
	var beckhoff = new require('./modules/beckhoff')(sandbox, {});

if( _.contains(ops.modules, 'embedded') )
	var embedded = new require('./modules/embedded')(sandbox, {});

if( _.contains(ops.modules, 'gpio') )
	var gpio = new require('./modules/gpio')(sandbox, {});

if( _.contains(ops.modules, 'xbmc') )
	var xbmc = new require('./modules/xbmc')(sandbox, {});

if( _.contains(ops.modules, 'mqtt') )
	var mqtt = new require('./modules/mqtt')(sandbox, {});

// Always load the controller module
// What is home automation if you don't control anything?
var controller = new require('./modules/controller')(sandbox, {});

sandbox.on('message', function( data ) {
	logger.debug('Sandbox received event:', data);
});