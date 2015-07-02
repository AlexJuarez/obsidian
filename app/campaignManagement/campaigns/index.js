define(function (require) {
    'use strict';

    require('./services/campaignsByStatus');
    require('./services/campaignCache');
    require('./services/campaignsByAccount');
    require('./factories/campaignAccordionTable');
    require('./controllers/newCampaign');
    require('./controllers/campaigns');
    require('./controllers/campaign');
});
