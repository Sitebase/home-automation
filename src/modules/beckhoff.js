/**
 * This module will listen for XBMC events on the XBMC devices for specific events.
 * For example starting/pause of movies
 */
var logger = require('../lib/logger'),
	ads = require('ads'),
	_sandbox = null,
	_client = null;

var options = {
    //The IP or hostname of the target machine
    host: "192.168.1.169", 
    //The NetId of the target machine
    amsNetIdTarget: "5.14.167.137.1.1",
    //The NetId of the source machine.
    //You can choose anything in the form of x.x.x.x.x.x,
    //but on the target machine this must be added as a route.
    amsNetIdSource: "192.168.1.101.1.1",
    //amsNetIdSource: "192.168.1.115.1.1",

    //OPTIONAL: (These are set by default) 
    //The tcp destination port
    //port: 27905,
    verbose: false,
    //The ams source port
    //amsPortSource: 32905
    //The ams target port
    //amsPortTarget: 801
    //amsPortTarget: 27905
};

function Beckhoff( sandbox, options ) {
	_sandbox = sandbox;
	logger.debug('Start module Beckhoff');

	listen();
}

/**
 * Start listning for different events on 
 * the supplied connection
 */
function listen() {

	_client = ads.connect(options, function() {
	    this.notify({ symname: '.LBUREAU', bytelength: ads.BOOL });
	    this.notify({ symname: '.KBUREAUNAARLIVINGLICHT', bytelength: ads.BOOL });
	    this.notify({ symname: '.LDCIRKELDRUKKNOPZONDERFUNCTIE1', bytelength: ads.BOOL });
	    this.notify({ symname: '.KLIVINGCIRKELROL3VENSTERSLINKSBOVEN', bytelength: ads.BOOL });
	    this.notify({ symname: '.KLIVINGCIRKELROL3VENSTERSLINKSONDER', bytelength: ads.BOOL });
	    this.notify({ symname: '.KKEUKENEILANDLEDSONDER', bytelength: ads.BOOL });
	    this.notify({ symname: '.KKEUKENEILANDLICHTEILAND', bytelength: ads.BOOL });
	    this.notify({ symname: '.KKEUKENEILANDRESERVE', bytelength: ads.BOOL });
        this.notify({ symname: '.KKEUKENEILANDSPOTSWASBAK', bytelength: ads.BOOL });
	});

	_client.on('notification', function(handle){
	    logger.debug('Value changed', handle.symname, handle.value);
        var value = handle.value == 1 ? true : false;
	    trigger( handle.symname, value );
	});

    _sandbox.on('button1', function(h) {
        pulse('.CTOGGLEOFFICELIGHT');
    });

    _sandbox.on('button2', function(h) {
        pulse('.CCLOSESHUTTER');
    });

    _sandbox.on('button3', function(h) {
        pulse('.COPENSHUTTER');
    });

    _sandbox.on('button4', function(h) {
        pulse('.CTOGGLEHEATBEDROOM');
    });

}

/**
 * Helper function to publish an event
 * @param  {string} name 
 * @return {void}      
 */
function trigger( name, value ) {
	_sandbox.emit('message', {
		trigger: name,
		type: 'state',
		location: 'make-based-on-sym-name',
		value: value
	});
}

function pulse( variable )
{
    var myHandle = {
            symname: variable,
            bytelength: ads.BOOL,
            propname: 'value',
            value: true
        };
        //console.log('WRITE', myHandle);
        _client.write(myHandle, function(err, handle) {
            //console.log('Written', err, handle);
        });
}

process.on('exit', function () {
    console.log("exit");
});

process.on('SIGINT', function() {
    _client.end(function() {
        process.exit();
    });
});

/*

var ads = require('./ads');

var options = {
    //The IP or hostname of the target machine
    host: "192.168.1.169", 
    //The NetId of the target machine
    amsNetIdTarget: "5.14.167.137.1.1",
    //The NetId of the source machine.
    //You can choose anything in the form of x.x.x.x.x.x,
    //but on the target machine this must be added as a route.
    amsNetIdSource: "192.168.1.101.1.1",

    //OPTIONAL: (These are set by default) 
    //The tcp destination port
    //port: 27905,
    verbose: true
    //The ams source port
    //amsPortSource: 32905
    //The ams target port
    //amsPortTarget: 801
    //amsPortTarget: 27905
};

var myHandle = {
    symname: '.LBUREAU',//'.KBUREAUNAARLIVINGLICHT',       
    bytelength: ads.BOOL,  

    //OPTIONAL: (These are set by default)       
    //transmissionMode: ads.NOTIFY.ONCHANGE, (other option is ads.NOTIFY.CYLCIC)
    //maxDelay: 0,  -> Latest time (in ms) after which the event has finished
    //cycleTime: 10 -> Time (in ms) after which the PLC server checks whether the variable has changed
};

client = ads.connect(options, function() {
    this.notify(myHandle);
});

client.on('notification', function(handle){
    console.log(handle.value);
});

process.on('exit', function () {
    console.log("exit");
});

process.on('SIGINT', function() {
    client.end(function() {
        process.exit();
    });
});

 */

module.exports = Beckhoff;