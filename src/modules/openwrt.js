/**
 * This module can listen for events in the OpenWRT logs
 */
var remote = require('node-remote-events'),
	logger = require('../lib/logger'),
	_sandbox = null;

function OpenWRT( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module OpenWRT');
	
	remote.connect({
		host: '54.164.43.98',
		port: 22,
		username: 'ubuntu',
		privateKey: require('fs').readFileSync('/Users/wim/.ssh/Red5.pem'),
		events: {
			'login': 'Accepted publickey'
		}
	}).done( listen );

}

/**
 * Start listning for different events on 
 * the supplied connection
 */
function listen( connection ) {
	connection.on('login', function( line ) {
		trigger( 'ssh.login' );
	});
}

/**
 * Helper function to publish an event
 * @param  {string} name 
 * @return {void}      
 */
function trigger( name ) {
	_sandbox.emit('message', {
		trigger: name,
		type: 'action',
		location: 'basement',
	});
}

module.exports = OpenWRT;