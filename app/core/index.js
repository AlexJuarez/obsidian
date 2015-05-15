/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./navbar/navbar');
    require('./services/dataFactory');
    require('./navbar/services/division');
    require('./navbar/services/campaign');
    require('./navbar/services/client');
    require('./navbar/services/account');
    require('./navbar/directives/clientDropdown');
    require('./navbar/directives/divisionDropdown');
    require('./navbar/directives/accountDropdown');
    require('./navbar/directives/campaignDropdown');
    require('./directives/dropdown');
    require('./directives/tooltip');
    require('./filters/safeFilter');
    require('./filters/interpolateFilter');
    require('./services/store');

});
