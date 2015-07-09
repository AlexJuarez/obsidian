define(function (require) {
    'use strict';

    require('./services/campaignsByStatus');
    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./factories/campaignAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');

    require('./directives/campaignDetails');
    require('./directives/creativeThumbnails');
    require('./placements/controllers/list');
    require('./creatives/controllers/list');
    require('./creatives/controllers/thumbnails');
});
