define(function (require) {
    'use strict';

    require('./routes');
    require('./divisions/index');
    require('./campaigns/index');
    require('./clients/index');
    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./accounts/index');
});
