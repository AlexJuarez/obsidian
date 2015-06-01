var endpointFactory = require( "../../utils/endpointFactory" );
var setLogic = require( "../../utils/setLogic" );
var fixture = require( "../../fixtures/thorwhalData/accounts" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.accounts,
	endpointName: "accountSet",
	responseLogic: function( req, res, items ) {
		res.send( {
			accountSet: setLogic( req, items )
		} );
	}
} );
module.exports = endpoint;
