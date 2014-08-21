require('colors');
var stdio = require('stdio');
var EventEmitter = require('events').EventEmitter;
var logger = require('./lib/logger');
var _ = require('lodash');

var ops = stdio.getopt({
    'modules': {key: 'm', args: 1, mandatory: true, description: 'What this option means'},
});

// Make array of modules option
ops.modules = ops.modules.split(',');

logger.debug('Start modules');
var sandbox = new EventEmitter();

if( _.contains(ops.modules, 'webapp') )
	var webapp = new require('./modules/webapp')(sandbox, {});

if( _.contains(ops.modules, 'embedded') )
	var embedded = new require('./modules/embedded')(sandbox, {});

if( _.contains(ops.modules, 'gpio') )
	var gpio = new require('./modules/gpio')(sandbox, {});

if( _.contains(ops.modules, 'xbmc') )
	var xbmc = new require('./modules/xbmc')(sandbox, {});


sandbox.on('message', function( data ) {
	logger.debug('Sandbox received event:', data);
});



//render();