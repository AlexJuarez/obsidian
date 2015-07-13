define(function (require) {
    'use strict';

    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./services/campaignsByStatus');
    require('./services/campaignsFilter');
    require('./services/campaignsHeader');
    require('./campaignManagement/campaigns/factories/campaignsByStatusAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');

    require('./directives/campaignDetails');
    require('./directives/campaignsByAccount');
    require('./directives/campaignsByStatus');
    require('./placements/controllers/placementsList');
    require('./creatives/controllers/creativesList');
    require('./creatives/controllers/creagivesThumbnails');
});
