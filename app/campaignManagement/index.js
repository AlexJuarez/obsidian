define(function (require) {
    'use strict';

    require('./routes');
    require('./divisions/index');
    require('./campaigns/index');
    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./clients/directives/activeSummary');
    require('./clients/controllers/clients');
    require('./clients/controllers/newClient');
    require('./clients/services/topClients');
    require('./accounts/index');
    require('./accounts/controllers/accounts');
    require('./accounts/controllers/newAccount');
});
