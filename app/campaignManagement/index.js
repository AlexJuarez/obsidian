/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./routes');
    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./campaigns/services/campaignsByStatus');
    require('./campaigns/directives/campaignDetails');
    require('./campaigns/factories/campaignAccordionTable');
    require('./campaigns/controllers/newCampaign');
    require('./campaigns/controllers/campaigns');
    require('./campaigns/controllers/campaign');
    require('./clients/directives/activeSummary');
    require('./clients/controllers/clients');
    require('./clients/controllers/newClient');
    require('./clients/services/topClients');
    require('./divisions/controllers/divisions');
    require('./accounts/index');
    require('./accounts/controllers/accounts');
    require('./accounts/controllers/newAccount');
});
