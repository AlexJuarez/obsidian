var getById = require( "./getById" );
var clients = require( "../fixtures/thorwhalData/clients.json" );
var divisions = require( "../fixtures/thorwhalData/divisions.json" );
var accounts = require( "../fixtures/thorwhalData/accounts.json" );

var parentFixtures = {
	client: clients.clients,
	division: divisions.divisions,
	account: accounts.accounts
};

module.exports = function( items ) {
	items.forEach( function( item ) {
		expandItemParents( item );
	} );
};

function expandItemParents( item ) {
	for ( parentType in parentFixtures ) {
		if ( typeof item[ parentType ] === "string" ) {
			var parentId = item[ parentType ];
			var parentCollection = parentFixtures[ parentType ];
			item[ parentType ] = getById( parentCollection, parentId );
		}
	}
}
