var express = require('express'),
	app = express();
	socketio = require('socket.io'),
	logger = require('./lib/logger'),
	_sandbox = require('./lib/sandbox'),
	bodyParser = require('body-parser');

function WebApp( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module WebApp');
	var port = options.port || 5000;
	var server = app.listen(port, function() {
	    logger.debug('Webapp Listening on port', server.address().port);
	});


	//****** WEBAPP *******//
	
	app.disable('etag'); // Disable caching otherwise the API endpoint don't work if you test them in a regular browser
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'jade');
	app.set('views', _sandbox.getPath('/public'));

	app.use( bodyParser.json() ); // to support JSON-encoded bodies for POST request
	app.use( bodyParser.urlencoded() );



}

// @todo move this to a helper lib so we can use it also on other places
function isValidEvent( event ) {
	return (event.hasOwnProperty('trigger') && event.hasOwnProperty('type')) ? true : false;
}

WebApp(_sandbox, {});

module.exports = WebApp;