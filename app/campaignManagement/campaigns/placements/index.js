define(function (require) {
    'use strict';

    require('./placements/controllers/placementsList');
    require('./placements/controllers/placementsHeader');
    require('./placements/controllers/newEditPlacement');
    require('./placements/directives/placementOptions');
    require('./placements/directives/expandAnchorsDirections');
    require('./placements/services/placements');
    require('./placements/services/placementsByPublisher');
    require('./placements/services/placementsByCreative');
    require('./placements/services/placementsByAdType');
});
