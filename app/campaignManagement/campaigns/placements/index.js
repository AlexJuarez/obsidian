define(function (require) {
    'use strict';

    require('./controllers/placementsList');
    require('./controllers/placementsHeader');
    require('./controllers/newEditPlacement');
    require('./directives/placementOptions');
    require('./directives/expandAnchorsDirections');
    require('./services/placements');
    require('./services/placementsByPublisher');
    require('./services/placementsByCreative');
    require('./services/placementsByAdType');
});
