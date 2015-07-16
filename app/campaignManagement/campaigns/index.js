define(function (require) {
    'use strict';

    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./services/campaignsByStatus');
    require('./services/campaignsFilter');
    require('./services/campaignsHeader');
    require('./services/campaignModal');
    require('./factories/campaignsByStatusAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/editCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');
    require('./controllers/analyticsPreview');

    require('./directives/campaignDetails');
    require('./directives/campaignsByAccount');
    require('./directives/campaignsByStatus');
    require('./placements/controllers/list');
    require('./creatives/controllers/list');
    require('./creatives/controllers/thumbnails');
    require('./creatives/directives/creativeThumbnails');
});
