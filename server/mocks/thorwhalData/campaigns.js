var endpointFactory = require( "../../utils/endpointFactory" );
var collectionLogic = require( "../../utils/collectionLogic" );
var getCollectionProperties = require( "../../utils/getCollectionProperties" );
var fixture = require( "../../fixtures/thorwhalData/campaigns" );
var campaignsByStatus = require( "../../fixtures/thorwhalData/custom/campaignsByStatus.json" );

var endpoint = endpointFactory.createEndpoint( {
	fixture: fixture.campaigns,
	endpointName: "campaigns",
    fixtureEndpoints: [
        {
            queryParams: "?dimensions=id,name,startDate,endDate,budget,bookedImpressions&metrics=countPlacements,countCreatives,impressions&filters=status:eq:",
            fixture: campaignsByStatus
        }
    ],
	responseLogic: function( req, res, items ) {
		var campaigns = collectionLogic( req, items );
		campaigns = getCollectionProperties( {
			collection: campaigns,
			dimensions: req.query.dimensions,
			metrics: req.query.metrics
		} );

		res.send( {
			campaigns: campaigns
		} );
	}
} );
module.exports = endpoint;
