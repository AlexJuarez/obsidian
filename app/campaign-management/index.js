/**activeSummary
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./controllers/campaignManagement');
    require('./controllers/index');
    require('./clients/directives/activeSummary');
    require('./clients/controllers/client');
    require('./routes');
});
