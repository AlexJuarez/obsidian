module.exports = function( collection, id ) {
	var foundItem;
	collection.forEach( function( item ) {
		if ( item.id === id ) {
			foundItem = item;
		}
	} );

	return foundItem;
}
