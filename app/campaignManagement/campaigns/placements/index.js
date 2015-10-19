define(function(require) {
	'use strict';

	require('./controllers/placementsList');
	require('./controllers/placementsHeader');
	require('./controllers/newEditPlacement');
	require('./directives/placementOptions');
	require('./directives/rateTypes');
	require('./directives/startEndDates');
	require('./directives/assignPublisher');
	require('./directives/assignCreative');
	require('./directives/adTagTypes');
	require('./directives/expandAnchorsDirections');
	require('./services/placements');
	require('./services/placementsByPublisher');
	require('./services/placementsByCreative');
	require('./services/placementsByAdType');

	require('./directives/creativeTypeOptions/audioOff');
	require('./directives/creativeTypeOptions/playMode');
	require('./directives/creativeTypeOptions/skipCountdown');
});
