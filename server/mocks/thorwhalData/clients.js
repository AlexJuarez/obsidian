var endpointFactory = require( "../../utils/endpointFactory" );
var collectionLogic = require( "../../utils/collectionLogic" );
var fixture = require( "../../fixtures/thorwhalData/clients" );
var getCollectionProperties = require( "../../utils/getCollectionProperties" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.clients,
	endpointName: "clients",
	responseLogic: function( req, res, items ) {
		var clients = collectionLogic( req, items );
		clients = getCollectionProperties( {
			collection: clients,
			dimensions: req.query.dimensions,
			metrics: req.query.metrics
		} );

		res.send( {
			clients: clients
		} );
	}
} );
module.exports = endpoint;
