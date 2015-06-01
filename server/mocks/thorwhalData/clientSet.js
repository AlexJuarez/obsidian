var endpointFactory = require( "../../utils/endpointFactory" );
var setLogic = require( "../../utils/setLogic" );
var fixture = require( "../../fixtures/thorwhalData/clients" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.clients,
	endpointName: "clientSet",
	responseLogic: function( req, res, items ) {
		res.send( {
			clientSet: setLogic( req, items )
		} );
	}
} );
module.exports = endpoint;
