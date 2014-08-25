/**
 * Controller module will do the serial communication with the embedded device
 * that does the actual reading and writing of in and outputs
 * In our case we use an Arduino
 *
 * @todo getTemperature function to monitor temp in the controller case
 * @todo burn red light when not connected and green when connected
 * 
 */
var logger = require('../lib/logger'),
	api = require('node-embed-serial-api'),
	_sandbox = null,
	connection = null;

var states = {
	light13: false,
	light12: false,
	light11: false,
}

function Controller( sandbox, options )
{
	_sandbox = sandbox;
	logger.debug('Start module Controller');
	logger.debug('Controller config is', sandbox.config);

	var device = new api({
		baudrate: 115200
	});

	device.on('error', function( error ) {
		console.log('ERROR:', error)
	});


	device.on('ready', function( error ) {

		/*device.readAnalog(function( result ) {
			console.log('Analog receive', result);
		});*/

		/*device.readDigital(function( result ) {
			console.log('Digital receive', result);
		});*/

		device.on('digital.interrupt', function( result ) {
			logger.debug('Digital interrupt received', result);
			_sandbox.emit('button1');
		});

		listen( device );

	});
	device.connect('/dev/tty.usbmodemfa141');

}

function listen( device )
{
	var timer = null;
	_sandbox.on('button1', function() {
		states.light13 = !states.light13;
		console.log('Button click 1');
		device.writeDigital(13, (states.light13 ? 1 : 0));
	});

	_sandbox.on('button2', function() {
		states.light12 = !states.light12;
		console.log('Button click 2');
		device.writeDigital(12, (states.light12 ? 1 : 0));
	});

	_sandbox.on('button3', function() {
		states.light11 = !states.light11;
		console.log('Button click 3');
		device.writeDigital(11, (states.light11 ? 1 : 0));
	});

	_sandbox.on('button4', function() {
		device.writeDigital(11, 0);
		device.writeDigital(12, 0);
		device.writeDigital(13, 0);
		clearInterval(timer);
	});

	_sandbox.on('button5', function() {
		device.writeDigital(11, 1);
		device.writeDigital(12, 1);
		device.writeDigital(13, 1);
	});

	_sandbox.on('button6', function() {
		clearInterval(timer);
		timer = setInterval(function(){
			device.writeDigital(11, Math.floor((Math.random() * 2)));
			device.writeDigital(12, Math.floor((Math.random() * 2)));
			device.writeDigital(13, Math.floor((Math.random() * 2)));
		}, 400);
	});
}

module.exports = Controller;