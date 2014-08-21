var mqtt = require('mqtt');
var logger = require('../lib/logger');
var _sandbox = null;

function Construct( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module Embedded');
	
	var port = options.port || 1883;
	mqtt.createServer(function(client) {
		var self = this;
		logger.debug('MQTT Listening on port', port);

		if (!self.clients) self.clients = {};

		client.on('connect', function(packet) {
			console.log('MQTT Client connected');
			client.connack({returnCode: 0});
			client.id = packet.clientId;
			self.clients[client.id] = client;
		});

		client.on('publish', function(packet) {
			console.log('MQTT Client publish', packet);
			for (var k in self.clients) {
			  self.clients[k].publish({topic: packet.topic, payload: packet.payload});
			}
		});

		client.on('subscribe', function(packet) {
			var granted = [];
			for (var i = 0; i < packet.subscriptions.length; i++) {
			  granted.push(packet.subscriptions[i].qos);
			}

			client.suback({granted: granted, messageId: packet.messageId});
		});

		client.on('pingreq', function(packet) {
			client.pingresp();
		});

		client.on('disconnect', function(packet) {
			client.stream.end();
		});

		client.on('close', function(err) {
			delete self.clients[client.id];
		});

		client.on('error', function(err) {
			client.stream.end();
			console.log('error!');
		});
	}).listen( port );
}


module.exports = Construct;