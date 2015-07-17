define(function (require) {
    'use strict';

    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./services/campaignsByStatus');
    require('./services/campaignsFilter');
    require('./services/campaignsHeader');
    require('./factories/campaignsByStatusAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');

    require('./directives/campaignDetails');
    require('./directives/campaignsByAccount');
    require('./directives/campaignsByStatus');

    require('./placements/controllers/placementsList');
    require('./placements/controllers/placementsHeader');
    require('./placements/services/placements.js');
    require('./placements/services/placementsByPublisher.js');
    require('./placements/services/placementsByCreative.js');
    require('./placements/services/placementsByAdType.js');

    require('./creatives/controllers/creativesHeader');
    require('./creatives/controllers/creativesList');
    require('./creatives/controllers/creativesThumbnails');
    require('./creatives/directives/creativeThumbnails');
    require('./creatives/services/campaignCreative');
});
