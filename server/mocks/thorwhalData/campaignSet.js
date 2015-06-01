var endpointFactory = require( "../../utils/endpointFactory" );
var setLogic = require( "../../utils/setLogic" );
var fixture = require( "../../fixtures/thorwhalData/campaigns" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.campaigns,
	endpointName: "campaignSet",
	responseLogic: function( req, res, items ) {
		res.send( {
			campaignSet: setLogic( req, items )
		} );
	}
} );
module.exports = endpoint;
