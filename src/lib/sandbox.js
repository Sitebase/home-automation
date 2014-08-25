var EventEmitter = require('events').EventEmitter,
	util = require('util');

function Sandbox()
{
	
}

util.inherits(Sandbox, EventEmitter);

Sandbox.prototype.getPath = function( suffix ) {
	suffix = suffix || '';
	return process.mainModule.filename.replace('index.js', suffix);
}





module.exports = new Sandbox();