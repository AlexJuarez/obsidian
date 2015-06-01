var _ = require( "lodash" );

/**
 * Get a potentially deep property of an object based on a string like "object.cats.fuzzy"
 *
 * @param object
 * @param propertyString
 */

module.exports = function( object, propertyString ) {
	var keys = propertyString.split( "." );

	var explorer = _.assign( {}, object );
	var retValue;

	keys.forEach( function( key ) {

		if ( !explorer[ key ] ) {

			// The property doesn't exist on the source!
			return object;
		}

		explorer = explorer[ key ];
		if ( typeof explorer !== "object" ) {
			// We've found the end value
			retValue = explorer;
		}
	} );

	return retValue;
}
