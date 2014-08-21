var express = require('express');
var app = express();
var socketio = require('socket.io');
var logger = require('../lib/logger');
var _sandbox = null;

function WebApp( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module WebApp');
	var port = options.port || 3000;
	var server = app.listen(port, function() {
	    logger.debug('Webapp Listening on port', server.address().port);
	});


	var io = socketio.listen(server, {'log level': 0}).on('connection', function (socket) {
		socket = socket;
		socket.on('message', function (json) {
			logger.debug('Message from webapp:', json);
			_sandbox.emit('message', json);
	    });

		// @todo to make the webapp also update when other modules change the state of something you can use socket.emit to publish
		// the new states to the webapp
	});
}

app.use(express.static(__dirname + '/../public'));
app.get('/', function(req, res){
	res.sendfile('src/index.html');
});

module.exports = WebApp;