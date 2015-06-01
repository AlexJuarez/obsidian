var collectionLogic = require( "./collectionLogic" );
var groupBy = require( "./groupBy" );
var makeMetrics = require( "./metrics/makeMetrics" );

module.exports = function( req, collection ) {
	var dimensions = req.query.dimensions || false;
	var metrics = req.query.metrics || false;

	var groups = groupBy( {
		collection: collection,
		dimensions: dimensions
	} );

	// We'll add metrics manually, so let's wipe them before passing them to
	// the collection logic
	req.query.metrics = false;
	groups = collectionLogic( req, groups );

	// Now we can add metrics based on custom aggregate rules
	return makeMetrics( groups, metrics );
}
