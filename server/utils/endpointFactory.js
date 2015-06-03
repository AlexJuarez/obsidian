var expandParents = require( "./expandParents" );

module.exports = {
	/**
	 *
	 * @param data {
	 * 		endpointName: string,
	 * 		fixture: string*,
	 * 		responseLogic: function( req, res, items ) - what to send back
	 *
	 * }
	 * @returns {Function}
	 */
	createEndpoint: function( data ) {

		expandParents( data.fixture );

		return function( app ) {
            app.get( "/api/v3/" + data.endpointName, function( req, res ) {
				return data.responseLogic( req, res, data.fixture );
			} );
        };
	}
};
