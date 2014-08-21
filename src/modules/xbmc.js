var remote = require('node-remote-events');
var express = require('express');
var app = express();
var socketio = require('socket.io');
var logger = require('../lib/logger');
var _sandbox = null;

function XBMC( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module WebApp');
	
	remote.connect({
		host: '54.164.43.98',
		port: 22,
		username: 'ubuntu',
		privateKey: require('fs').readFileSync('/Users/wim/.ssh/Red5.pem'),
		events: {
			'movie.play': '[mM]ovie',
			'audio.play': 'audio',
			'login': 'Accepted publickey'
		}
	}).done(function(conn) {

		conn.on('movie.play', function( line ) {
			_sandbox.emit('message', {
				trigger: 'movie.play',
				type: 'action',
				location: 'livingroom',
			});
		});
		conn.on('audio.play', function( line ) {
			_sandbox.emit('message', {
				trigger: 'audio.play',
				type: 'action',
				location: 'livingroom',
			});
		});
		conn.on('login', function( line ) {
			_sandbox.emit('message', {
				trigger: 'ssh.login',
				type: 'action',
				location: 'livingroom',
			});
		});
	});

}



module.exports = XBMC;

/*
remote.connect({
	host: '54.164.43.98',
	port: 22,
	username: 'ubuntu',
	privateKey: require('fs').readFileSync('/Users/wim/.ssh/Red5.pem'),
	events: {
		'play.movie': '[mM]ovie',
		'play.audio': 'audio',
		'login': 'Accepted publickey'
	}
}).done(function(conn) {
	console.log('connection ready');

	conn.on('play.movie', function( line ) {
		console.log('Movie start:', line);
	});

	conn.on('play.audio', function( line ) {
		console.log('Audio start:', line);
	});

	conn.on('login', function( line ) {
		console.log('Someone logged into the server');
	});
});*/