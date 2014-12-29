var express = require('express'),
	app = express();
	socketio = require('socket.io'),
	logger = require('../lib/logger'),
	bodyParser = require('body-parser'),
	_sandbox = null;

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

			// Also emit with trigger as emit string
			_sandbox.emit(json.trigger, json);
	    });

	    _sandbox.on('message', function(data) {
			if((data.trigger === "temperature" || data.type === "state") && socket !== null) {
		    	socket.emit('data', data);
		    }

		});

		// @todo to make the webapp also update when other modules change the state of something you can use socket.emit to publish
		// the new states to the webapp
	});

	//****** WEBAPP *******//
	
	app.disable('etag'); // Disable caching otherwise the API endpoint don't work if you test them in a regular browser
	app.use(express.static(__dirname + '/../public'));
	app.set('view engine', 'jade');
	app.set('views', _sandbox.getPath('/public'));

	app.use( bodyParser.json() ); // to support JSON-encoded bodies for POST request
	app.use( bodyParser.urlencoded() );
	/*app.get('/', function(req, res){
		console.log('render html');
		//res.send('ok');
		res.render('views/layout.jade',  {'title': 'HELLO BLA'});
	});*/

	/**
	 * Add GET endpoint to trigger an event by using
	 * a regular HTTP request
	 *
	 * @example curl -X GET -d 'trigger=test&type=click' -s http://localhost:3000/api
	 */
	app.get('/api', function(req, res){
		res.setHeader('content-type', 'text/json');

		if( isValidEvent(req.query) ) {
			res.send('{"status": "ok"}');
			_sandbox.emit('message', req.query);
			_sandbox.emit(req.query.trigger, req.query);
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
			res.send('{"status": "ok"}');
			_sandbox.emit('message', req.query);
			_sandbox.emit(req.query.trigger, req.query);
		} else {
			res.send('{"status": "error"}');
		}
	});




}

// @todo move this to a helper lib so we can use it also on other places
function isValidEvent( event ) {
	return (event.hasOwnProperty('trigger') && event.hasOwnProperty('type')) ? true : false;
}

module.exports = WebApp;