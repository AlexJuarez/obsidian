var filterOnProperty = require( "./filterOnProperty" );
var orderBy = require( "./orderBy" );

module.exports = function( req, collection ) {
	var filters = req.query.filters || false;
	var order = req.query.order || false;
	var orderDirection = req.query.orderDirection || "desc";
	var limit = req.query.limit || false;
	var offset = req.query.offset || 0;

	if ( filters ) {
		filters.split( "," ).forEach( function( filterString ) {
			collection = filterOnProperty( {
				collection: collection,
				filters: filters
			} );
		} );
	}

	if ( order ) {
		var orderDimensions = order.split( "," );
		collection = orderBy( {
			collection: collection,
			orderDimensions: orderDimensions,
			orderDirection: orderDirection
		} );
	}

	if ( limit ) {
		collection = collection.slice( offset, limit );
	}

	return collection;
}
