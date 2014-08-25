/**
 * Controller module will do the serial communication with the embedded device
 * that does the actual reading and writing of in and outputs
 * In our case we use an Arduino
 *
 * @todo getTemperature function to monitor temp in the controller case
 * @todo burn red light when not connected and green when connected
 * 
 */
var serialport = require('serialport'),
	logger = require('../lib/logger'),
	fs = require('fs'),
	SerialPort = serialport.SerialPort;
	_sandbox = null,
	connection = null;

// Arduino serial configuration
var config = {
	baudrate: 19200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false,
	parser: serialport.parsers.readline("\r")
}

function Controller( sandbox, options )
{
	_sandbox = sandbox;
	logger.debug('Start module Controller');
	logger.debug('Controller config is', sandbox.config);


	fs.exists(_sandbox.config.serial_controller, function(exists) {
		if (exists) {
			// Detect if embedded controller is connected
			connection = new SerialPort(_sandbox.config.serial_controller, config);
			connection.open(function (error) {
				if( error ) {
					logger.error(error.toString().replace('Error: ', ''));
					logger.error('Connect the embbeded controller to USB');
				} else {
					init();
				}
			});
		} else {
			logger.debug('No embedded controller connected -> ' + _sandbox.config.serial_controller);
		}
	});

}

/**
 * This will only be executed if the serial interface can be opened
 */
function init() {

	logger.debug('Connected with the embedded controller');

	connection.on('data', function(data) {
		result = data.trim();
		console.log('data received: ' + result);

		if( result === 'yo' ) {
			connected = true;
		}

		/*if (result === 'OK') {
		  console.log('command successful');
		}
		else {
		  console.log('command not successful');
		}*/
	});

	setTimeout(function() {
		connection.write(' '); // This will make the Arduino loop enter the Serial available condition    
	}, 3000);

	connection.on('error', function (err) {
		console.error("error", err);
	});

}





module.exports = Controller;