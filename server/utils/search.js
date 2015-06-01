/**
 *
 * @param data {
 * 		collection: array,
 * 		searchTerm: string
 * }
 * @returns [*]
 */
module.exports = function( data ) {
	var collectionFilteredBySearch = [];
	var current;

	for ( var i = 0; i  < data.collection.length; i++ ) {
		current = data.collection[ i ];
		if ( current.name.indexOf( data.searchTerm ) > -1 ) {
			collectionFilteredBySearch.push( current );
		}
	}

	var hasTermAtBeginning = function( string, term ) {
		return string.match( new RegExp( "^" ) + term );
	};

	collectionFilteredBySearch.sort( function( a, b ) {
		var aIsPreferred = hasTermAtBeginning( a.name, data.searchTerm );
		var bIsPreferred = hasTermAtBeginning( b.name, data.searchTerm );

		if ( aIsPreferred && !bIsPreferred ) {
			return 1;
		} else if ( bIsPreferred && !aIsPreferred ) {
			return -1;
		} else {
			return 0;
		}
	} );

	return collectionFilteredByParent;
}
