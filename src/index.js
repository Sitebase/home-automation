require('colors');
var stdio = require('stdio');
var EventEmitter = require('events').EventEmitter;
var logger = require('./lib/logger');
var _ = require('lodash');

var ops = stdio.getopt({
    'modules': {key: 'm', args: 1, mandatory: true, description: 'What this option means'},
});

// Make array of modules option
ops.modules = ops.modules.split(',');

logger.debug('Start modules');
var sandbox = new EventEmitter();

if( _.contains(ops.modules, 'webapp') )
	var webapp = new require('./modules/webapp')(sandbox, {});

if( _.contains(ops.modules, 'embedded') )
	var embedded = new require('./modules/embedded')(sandbox, {});

if( _.contains(ops.modules, 'gpio') )
	var gpio = new require('./modules/gpio')(sandbox, {});

if( _.contains(ops.modules, 'xbmc') )
	var xbmc = new require('./modules/xbmc')(sandbox, {});

if( _.contains(ops.modules, 'openwrt') )
	var xbmc = new require('./modules/openwrt')(sandbox, {});

sandbox.on('message', function( data ) {
	logger.debug('Sandbox received event:', data);
});



//render();




////////////// SERIAL CONTROLLER
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var command = 'LEDON';
var connected = false;
// /dev/tty.usbmodemfa141
// /dev/ttyACM0
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 19200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: serialport.parsers.readline("\r")
});

var is_available = false;

serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
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
    serialPort.write(' '); // This will make the Arduino loop enter the Serial available condition    
  }, 3000);
  
  serialPort.on('error', function (err) {
      console.error("error", err);
  });
});

sandbox.on('button1', function( data ) {

	if( connected === false ) {
		console.log('Not yet connected');
	} else {
		console.log('Ok we\'ll do it');

		serialPort.write(command + '#', function(error) {
	      // If error is undefined all is ok
	      //console.log('err ' + err);
	    });

	    if(command == 'LEDON') {
	      command = 'LEDOFF';
	    } else {
	      command = 'LEDON';
	    }
	}

});

/*setInterval(function() {
  if(connected) {
    if(command == 'LEDON') {
      command = 'LEDOFF';
    } else {
      command = 'LEDON';
    }

    serialPort.write(command + '#', function(error) {
      // If error is undefined all is ok
      //console.log('err ' + err);
    });

  } else {
    console.log('Not yet connected');
  }
}, 100);*/