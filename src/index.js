require('colors');
var EventEmitter = require('events').EventEmitter;

var logger = require('./lib/logger');

logger.debug('Start modules');
var sandbox = new EventEmitter();
var webapp = new require('./modules/webapp')(sandbox, {});
var embedded = new require('./modules/embedded')(sandbox, {});



sandbox.on('message', function( data ) {
	logger.debug('Sandbox received event:', data);
});



//render();