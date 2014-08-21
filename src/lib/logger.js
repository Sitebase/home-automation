/**
 * @todo detect if environment is unit testing, if so don't log anything
 */
var _ = require('lodash'),
	colors = require('colors');

function log() {

	if( arguments.length === 0 ) 
		return;

	var prefix = 'INFO - '.cyan;
	var caller = arguments.callee.caller;

	// Don't log debug events in production environment
	if( process.env.ENVIRONMENT === 'production' && caller === debug )
		return;

	// Determine color to use
	if( caller === error ) prefix = "ERROR".red + " - ";
	if( caller === debug ) prefix = "DEBUG".green + " - ";

	var data = _.values( arguments );
	data = _.map( data, function( value ) {
		if( _.isObject(value) || _.isArray(value) ) {
			return JSON.stringify( value );
		}
		return value;
	});


	console.log( prefix, data.join(' ') );
}

function error() { log.apply(this, arguments); }
function debug() { log.apply(this, arguments); }

module.exports = {
	log: log,
	error: error,
	debug: debug,
};