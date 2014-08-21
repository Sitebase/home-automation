/**
 * This module will listen for input event on the GPIO pin, for example a switch that is pressed
 * The reason we use the onoff module is because it supports interrupts. Other libraries seem to use polling a lot 
 * and this can cause high CPU usage which is not what we want on devices like a Raspberry Pi.
 */
var Gpio = require('onoff').Gpio
var logger = require('../lib/logger');
var _sandbox = null;

function Gpio( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module GPIO');
	
    button1 = new Gpio(18, 'in', 'both');
	button1.watch(function(err, value) {
		var data = { 
			trigger: 'button1',
			type: 'click',
			location: 'bedroom', // This value need to be specified based on what swith this is
		};
		_sandbox.emit('message', data);
	});

}

module.exports = Gpio;