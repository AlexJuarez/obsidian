var _ = require( "lodash" );

/**
 *
 * Groups an array of items by one or more dimensions.
 *
 * @param data {
 * 		collection: [*],
 * 		dimensions: string, group by comma-separated dimensions
 * }
 * @returns [*] the collection grouped by dimensions
 */
module.exports = function( data ) {
	var collection = data.collection;

	if ( !data.dimensions ) {
		return [ { items: collection } ];
	}

	var dimensions = data.dimensions.split( "," );
	var lodashGroups = _.groupBy( collection, function( item ) {
		var dimensionValues = {};

		dimensions.forEach( function( dimension ) {
			dimensionValues[ dimension ] = item[ dimension ];
		} );

		return JSON.stringify( dimensionValues );
	} );

	// Lodash groups look like
	// {"string": [ { collectionObject1 }, { collectionObject2 } ] }
	// Transform them into something like
	// [ {
	// 		dimension1: value1,
	// 		dimension2: value2,
	// 		items: [ { collectionObject1 }, { collectionObject2 } ]
	// } ]
	var groups = [];
	for ( groupId in lodashGroups ) {
		groups.push(
			_.extend(
				{ items: lodashGroups[ groupId ] },
				JSON.parse( groupId )
			)
		);
	}

	return groups;
}
