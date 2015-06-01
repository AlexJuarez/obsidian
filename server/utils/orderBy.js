var deepFindProperty = require( "./deepFindProperty" );

/**
 *
 * @param data {
 * 		collection: [*],
 * 		orderDimensions: string orderBy is the index into the object on which to sort,
 * 		orderDirection: string either asc or desc
 * }
 * @returns [*]
 */
module.exports = function( data ) {
	var orderDimensions = data.orderDimensions;

	var recursiveComparison = function( a, b, currentDimensionIndex ) {
		var value;

		if ( typeof currentDimensionIndex === "undefined" ) {
			currentDimensionIndex = 0;
		}

		if ( orderDimensions.length <= currentDimensionIndex ) {
			value = 0;
		} else {
			var currentDimension = orderDimensions[ currentDimensionIndex ];
			var propertyA = deepFindProperty( a, currentDimension );
			var propertyB = deepFindProperty( b, currentDimension );
			if ( propertyA < propertyB ) {
				value = 1;
			} else if ( propertyA > propertyB ) {
				value = -1;
			} else {
				value = recursiveComparison( a, b, currentDimensionIndex + 1 );
			}
		}

		if ( data.orderDirection === "asc" ) {
			return value * -1;
		} else {
			return value;
		}
	}

	return data.collection.sort( recursiveComparison );
}
