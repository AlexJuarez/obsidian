/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./routes');
    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./campaigns/services/campaignsByStatus');
    require('./campaigns/factories/campaignAccordionTable');
    require('./campaigns/controllers/newCampaign');
    require('./clients/directives/activeSummary');
    require('./clients/controllers/client');
    require('./clients/controllers/clients');
    require('./clients/controllers/newClient');
    require('./clients/services/topClients');
    require('./campaigns/controllers/campaigns');
    require('./divisions/controllers/division');
    require('./accounts/index');
});
