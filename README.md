Pomo
====

Install NodeJS on Raspberry Pi
------------------------------

	sudo apt-get upgrade
	sudo apt-get update
	wget http://nodejs.org/dist/v0.10.2/node-v0.10.2-linux-arm-pi.tar.gz
	tar -xvzf node-v0.10.2-linux-arm-pi.tar.gz
	node-v0.10.2-linux-arm-pi/bin/node --version

Add node directory to your $PATH var:

	NODE_JS_HOME=/home/pi/node-v0.10.2-linux-arm-pi 
	PATH=$PATH:$NODE_JS_HOME/bin 

Want to compile/use native modules then install node-gyp:

	npm install -g node-gyp

Run
---
node src --modules webapp,embedded,gpio

Raspberry console screen sleep
------------------------------
To wake the screen over SSH you can use following commands:

	sudo chmod 666 /dev/tty1
	echo -ne "\033[9;0]" >/dev/tty1

Todo
----
* Add simple page with links to different apps (couchpatato, Transmit, ...)



 Example sensor value publish via socket.io
 socket.emit('data', {type: 'sensor', id: "garden-temperature", name: 'Serre', source: 'garden', value: Math.floor(Math.random() * 98)});


Event object
------------
### Click on siwth in the bedroom
	{ 
		trigger: 'button1',
		type: 'click',
		location: 'bedroom', // From where was this event triggered: garden, livingroom, bedroom, mobile (if from webapp)
	}

### Temperature sensor reading from an arduino in the garden
	{ 
		trigger: 'garden1',
		type: 'sensor',
		location: 'bedroom', // From where was this event triggered: garden, livingroom, bedroom, mobile (if from webapp)
		label: 'Garden temperature', // A label that can be used to visualize the temperature somewhere, for example in the webapp
		value: 32.2
	}

### Click on siwth on webapp
	{ 
		trigger: 'button1',
		type: 'click',
		location: 'mobile'
	}



Serial controller
-----------------





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
