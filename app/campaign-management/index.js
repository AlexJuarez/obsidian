/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./routes');
    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./clients/directives/activeSummary');
    require('./clients/controllers/client');
    require('./clients/controllers/clients');
    require('./clients/services/topClients');
    require('./divisions/controllers/division');
});
