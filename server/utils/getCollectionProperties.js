/**
 *
 * @param data {
 * 		collection: array,
 * 	  dimensions: string, looks like "id,name"
 * 	  metrics: string, looks like "impressions"
 * }
 * @returns [*]
 */

var metricFunctions = require( "./metrics/metricFunctions" );

module.exports = function( data ) {

	var dimensions = data.dimensions ?
		data.dimensions.split( "," ) :
		[];
	var metrics = data.metrics ?
		data.metrics.split( "," ) :
		[];

	var newCollection = [];

	data.collection.forEach( function( item ) {
		var newItem = {};

		if ( metrics.length > 0 ) {
			newItem.metrics = {};
		}

		dimensions.forEach( function( property ) {
			deepCopyProperty( item, newItem, property );
		} );

		metrics.forEach( function( metric ) {
            if (item.metrics && item.metrics[metric]) {
                newItem.metrics[ metric ] = item.metrics[ metric ];
            } else {
                newItem.metrics[ metric ] = metricFunctions[metric](item);
             }
		} );

		if ( Object.keys( newItem ).length !== 0 ) {
			newCollection.push( newItem );
		}
	} );

	return newCollection;
}

/**
 * Copy a property deep in an object into another object
 *
 * @param source
 * @param dest
 * @param propertyString something like cars.hondas.acura.color that is present
 * in source, but not necessarily in dest
 */
function deepCopyProperty( source, dest, propertyString ) {
	var keys = propertyString.split( "." );

	var sourceExplorer = source;
	var destExplorer = dest;

	keys.forEach( function( key ) {

		if ( !sourceExplorer[ key ] ) {

			// The property doesn't exist on the source!
			return source;
		}

		sourceExplorer = sourceExplorer[ key ];
		if ( typeof sourceExplorer !== "object" ) {

			// We've found the end value
			destExplorer[ key ] = sourceExplorer;
		} else {

			if ( !destExplorer[ key ] ) {
				destExplorer[ key ] = {};
			}

			destExplorer = destExplorer[ key ];
		}
	} );
}
