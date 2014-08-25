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

Daemon
------

sudo forever -d -v -o out.log -e error.log -l log.log src/index.js
