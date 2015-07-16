/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    require('./modal/index');
    require('./datepicker/index');
    require('./navbar/index');
    require('./factories/data');
    require('./factories/cache');
    require('./factories/pagination');
    require('./factories/domainInterceptor');
    require('./directives/dropdown');
    require('./directives/limit');
    require('./directives/tooltip');
    require('./directives/compile');
    require('./directives/placeholder');
    require('./directives/filePicker');
    require('./directives/pacingChart');
    require('./directives/creativePreviewModal');
    require('./filters/safe');
    require('./filters/interpolate');
    require('./filters/errorCount');
    require('./filters/date');
    require('./filters/truncateNumber');
    require('./services/channel');
    require('./services/clientSet');
    require('./services/divisionSet');
    require('./services/campaignCreative');
    require('./constants/apiURI');
});
