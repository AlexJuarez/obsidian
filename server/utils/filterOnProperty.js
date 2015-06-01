var deepFindProperty = require( "./deepFindProperty" );

/**
 *
 * @param data {
 * 		collection: array,
 * 		filters: string, looks like "creativeCount:lt:5"
 * }
 * @returns [*]
 */
module.exports = function( data ) {
	var filters = data.filters.split( "," );
	var collectionSubset = [];
	var currentFilter;
	var currentItem;
	var itemMatchesAllFilters;

	for ( var k = 0; k < data.collection.length; k++ ) {
		currentItem = data.collection[ k ];
		itemMatchesAllFilters = true;

		for ( var i = 0; i < filters.length; i++ ) {
			currentFilter = processFilterString( filters[ i ] );
			if (
				!compare(
					deepFindProperty( currentItem, currentFilter.property ),
					currentFilter.value,
					currentFilter.comparator
				)
			) {
				itemMatchesAllFilters = false;
			}
		}

		if ( itemMatchesAllFilters ) {
			collectionSubset.push( currentItem );
		}
	}

	return collectionSubset;
}

function processFilterString( filterString ) {
	var splitFilter = filterString.split( ":" );

	if ( splitFilter.length === 3 ) {
		return {
			property: splitFilter[ 0 ],
			comparator: splitFilter[ 1 ],
			value: splitFilter[ 2 ]
		}
	} else if ( splitFilter.length === 2 ) {
		return {
			property: splitFilter[ 0 ],
			comparator: "eq",
			value: splitFilter[ 1 ]
		}
	} else {
		return false;
	}

}

function compare( a, b, comparator ) {

	if ( typeof a === "boolean" ) {
		a = a.toString();
	}

	if ( comparator === "gt" ) {
		return a > b;
	} else if ( comparator === "lt" ) {
		return a < b;
	} else {
		return a === b;
	}
}
