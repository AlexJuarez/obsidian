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
    require('./placements/directives/placementsByPublisher');
    require('./placements/directives/placementsByCreative');
    require('./placements/directives/placementsByAdType');
    require('./placements/services/placements.js');

    require('./creatives/controllers/creativesList');
    require('./creatives/controllers/creativesThumbnails');
});
