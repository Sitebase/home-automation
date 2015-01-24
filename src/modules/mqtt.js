var mosca = require('mosca');
var logger = require('../lib/logger');
var discoverable = require('discoverable-node');
var _sandbox = null;

discoverable.makeDiscoverable(['homeautomation']);

function Construct( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module MQTT');
	
	var port = options.port || 1883;


	var pubsubsettings = {
		//using ascoltatore
		type: 'mongo',        
		url: 'mongodb://192.168.1.117:27017/mqtt',
		pubsubCollection: 'ascoltatori',
		mongo: {}
	};

	var moscaSettings = {
		port: 1883,           //mosca (mqtt) port
		backend: pubsubsettings   //pubsubsettings is the object we created above 
	};

	var server = new mosca.Server(moscaSettings);
	server.on('ready', setup);

	server.on('clientConnected', function(client) {
	    console.log('client connected', client.id);     
	});

	// fired when a message is received
	server.on('published', function(packet, client) {

		// Ignore system topics
		if( packet.topic.indexOf('$SYS') > -1 )
			return;

	  console.log('Published', packet);
	});

	// fired when the mqtt server is ready
	function setup() {
	  console.log('Mosca server is up and running')
	}
	
}


module.exports = Construct;