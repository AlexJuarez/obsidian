var endpointFactory = require( "../../utils/endpointFactory" );
var collectionLogic = require( "../../utils/collectionLogic" );
var fixture = require( "../../fixtures/thorwhalData/divisions" );
var getCollectionProperties = require( "../../utils/getCollectionProperties" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.divisions,
	endpointName: "divisions",
	responseLogic: function( req, res, items ) {
		var divisions = collectionLogic( req, items );
		divisions = getCollectionProperties( {
			collection: divisions,
			dimensions: req.query.dimensions,
			metrics: req.query.metrics
		} );

		res.send( {
			divisions: divisions
		} );
	}
} );
module.exports = endpoint;
