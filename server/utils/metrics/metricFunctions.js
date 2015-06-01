module.exports = {

	count: function( items ) {
		return items.length;
	},
	countLive: function( items ) {
		return randomNumber( 100 );
	},
    countAccounts: function( items ) {
        return randomNumber( 100 );
    },
	countActive: function() {
		return randomNumber( 100 );
	},
	countAccountsActive: function() {
		return randomNumber( 100 );
	},
    countCampaignsArchived: function() {
        return randomNumber( 100 );
    },
    countCampaignsCompleted: function() {
        return randomNumber( 100 );
    },
	countCampaignsActive: function() {
		return randomNumber( 100 );
	},
	countCampaignsPreFlight: function() {
		return randomNumber( 50 );
	},
	countCampaignsInFlight: function() {
		return randomNumber( 50 );
	}
}

function randomNumber( max ) {
	return Math.floor( Math.random() * max );
}
