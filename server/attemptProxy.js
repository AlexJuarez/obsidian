var request = require( "request" );
var _ = require( "lodash" );

module.exports = function( options, cookies ) {

	return function( req, res, next ) {
		var opts = _.assign( {}, options );
		opts = {
			url: options.url + req.originalUrl.replace( "/narwhal", "" ),
			headers: {
				cookie: "JSESSIONID=" + cookies.JSESSIONID
			}
		};

		request.get( opts, function( err, resp, body ) {
			if ( !err && resp.statusCode === 200 ) {
				res.send( body );
			} else {
				next();
			}
		} );
	};
};
