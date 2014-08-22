/**
 * This module will listen for XBMC events on the XBMC devices for specific events.
 * For example starting/pause of movies
 */
var remote = require('node-remote-events'),
	express = require('express'),
	app = express(),
	socketio = require('socket.io'),
	logger = require('../lib/logger'),
	_sandbox = null;

function XBMC( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module XBMC');
	
	remote.connect({
		host: '192.168.1.108',
		port: 22,
		username: 'wim',
		password: '****',
		monitorCmd: 'tail -f /home/wim/.xbmc/temp/xbmc.log',
		events: {
			'movie.play': 'DVDPlayer\: Opening\:',
			'movie.stop': 'thread end\: video_thread',
			//'audio.play': 'audio',
			//'login': 'Accepted publickey'
		}
	}).done( listen );

}

/**
 * Start listning for different events on 
 * the supplied connection
 */
function listen( connection ) {
	connection.on('movie.play', function( line ) {
		trigger( 'movie.play' );
	});
	connection.on('movie.stop', function( line ) {
		trigger( 'movie.stop' );
	});
	connection.on('audio.play', function( line ) {
		trigger( 'audio.play' );
	});
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
		location: 'livingroom',
	});
}

module.exports = XBMC;