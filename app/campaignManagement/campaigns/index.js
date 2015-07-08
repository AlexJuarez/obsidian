define(function (require) {
    'use strict';

    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./services/campaignsByStatus');
    require('./services/campaignsFilter');
    require('./services/campaignsHeader');
    require('./factories/campaignAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');

    require('./directives/campaignDetails');
    require('./placements/controllers/list');
    require('./creatives/controllers/list');
    require('./creatives/controllers/thumbnails');
});
