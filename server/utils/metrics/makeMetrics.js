var metricFunctions = require( "./metricFunctions" );

/**
 * Groups are passed in with the form:
 * [ {
 * 		dimension1: value1,
 * 		dimension2: value2,
 * 		items: [ { collectionObject1 }, { collectionObject2 } ]
 * } ]
 *
 * This module transforms the "items" property into aggregate metrics based
 * on those items. These metrics are stored on each object under the property
 * "metrics". The returned array should take the form:
 *
 * [ {
 * 		dimension1: value1,
 * 		dimension2: value2,
 * 		metrics: { count: 2, hasLive: false, ... }
 * } ]
 * @param groups
 * @param metrics
 */
module.exports = function( groups, metrics ) {

	if ( !metrics ) {
		removeItems( groups );
		return groups;
	}

	groups.forEach( function( group ) {
		group.metrics = {};
	} );

	metrics.split( "," ).forEach( function( metric ) {
		var metricFunction = metricFunctions[ metric ];
		if ( metricFunction ) {
			groups.forEach( function( group ) {
				group.metrics[ metric ] = metricFunction( group.items );
			} );
		}
	} );

	removeItems( groups );

	return groups;
}

function removeItems( groups ) {
	groups.forEach( function( group ) {
		delete group.items;
	} );
}
