/**
 * This express middleware reads login credentials from creds.js, then uses
 * those credentials to log into the proxy server. Subsequent requests to that
 * server will contain authentication cookies that were returned by the proxy server.
 */

var creds = require( "./creds" );
var _ = require( "lodash" );
var request = require( "request" );
var queryString = require( "querystring" );
var https = require( "https" );


module.exports = function( options, cookies ) {
	var data = queryString.stringify( {
		account: creds.username,
		password: creds.password,
		remember: true
	} );

	options = _.assign( options, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Content-Length": Buffer.byteLength( data )
		}
	} );

	request.post( {
		url: options.url,
		form: {
			account: creds.username,
			password: creds.password,
			remember: "true"
		}
	}, function( err, httpResponse, body ) {
		var sessionId = getSessionId( httpResponse.headers );
		if ( !sessionId ) {
			console.log(
				"No set-cookie present in auth headers! Are your credentials correct?"
			);
			console.log( httpResponse.headers );
		}
		cookies.JSESSIONID = sessionId;
	} );
};

function getSessionId( headers ) {
	if ( !headers[ "set-cookie" ] ) {
		return false;
	}
	var setCookie = headers[ "set-cookie" ][ 0 ];
    return setCookie.split( ";" )[ 0 ].split( "=" )[ 1 ];
}
