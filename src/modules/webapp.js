var express = require('express');
var app = express();
var socketio = require('socket.io');
var logger = require('../lib/logger');
var _sandbox = null;
var bodyParser = require('body-parser')

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

app.disable('etag'); // Disable caching otherwise the API endpoint don't work if you test them in a regular browser
app.use(express.static(__dirname + '/../public'));
app.use( bodyParser.json() ); // to support JSON-encoded bodies for POST request
app.use( bodyParser.urlencoded() );
app.get('/', function(req, res){
	res.sendfile('src/index.html');
});

/**
 * Add GET endpoint to trigger an event by using
 * a regular HTTP request
 *
 * @example curl -X GET -d 'trigger=test&type=click' -s http://localhost:3000/api
 */
app.get('/api', function(req, res){
	res.setHeader('content-type', 'text/json');

	if( isValidEvent(req.query) ) {
		_sandbox.emit('message', req.query);
		res.send('{"status": "ok"}');
	} else {
		res.send('{"status": "error"}');
	}
});

/**
 * Add GET endpoint to trigger an event by using
 * a regular HTTP request
 *
 * @example curl -X POST -s http://localhost:3000/api?trigger=test&type=click
 */
app.post('/api', function(req, res){
	res.setHeader('content-type', 'text/json');
	
	if( isValidEvent(req.query) ) {
		_sandbox.emit('message', req.query);
		res.send('{"status": "ok"}');
	} else {
		res.send('{"status": "error"}');
	}
});

// @todo move this to a helper lib so we can use it also on other places
function isValidEvent( event ) {
	return (event.hasOwnProperty('trigger') && event.hasOwnProperty('type')) ? true : false;
}

module.exports = WebApp;