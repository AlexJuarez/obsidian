var endpointFactory = require( "../../utils/endpointFactory" );
var collectionLogic = require( "../../utils/collectionLogic" );
var getCollectionProperties = require( "../../utils/getCollectionProperties" );
var fixture = require( "../../fixtures/thorwhalData/accounts" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.accounts,
	endpointName: "accounts",
	responseLogic: function( req, res, items ) {
		var accounts = collectionLogic( req, items );
		accounts = getCollectionProperties( {
			collection: accounts,
			dimensions: req.query.dimensions,
			metrics: req.query.metrics
		} );

		res.send( {
			accounts: accounts
		} );
	}
} );
module.exports = endpoint;
