define(function(require) {
    'use strict';

    require('./modal/index');
    require('./datepicker/index');
    require('./navbar/index');
    require('./constants/index');
    require('./creativePreview/index');
    require('./notifications/index');
    require('./select2/index');
    require('./ngPerfectScrollbar/index');

    services();
    filters();
    directives();
    factories();

    function factories() {
        require('./factories/data');
        require('./factories/cache');
        require('./factories/pagination');
        require('./factories/record');
        require('./factories/recordPool');
        require('./factories/domainInterceptor');
        require('./factories/observer');
    }

    function directives() {
        require('./directives/dropdown');
        require('./directives/limit');
        require('./directives/tooltip');
        require('./directives/compile');
        require('./directives/fallbackSrc');
        require('./directives/placeholder');
        require('./directives/filePicker');
        require('./directives/youWorkOn');
        require('./directives/loadingIndicator');
        require('./directives/modalFormRow');
        require('./directives/noContent');
    }

    function filters() {
        require('./filters/safe');
        require('./filters/interpolate');
        require('./filters/errorCount');
        require('./filters/date');
        require('./filters/truncateNumber');
        require('./filters/percentage');
        require('./filters/adTypeOrder');
        require('./filters/shortenAdType');
    }

    function services() {
        require('./services/channel');
        require('./services/clientRecord');
        require('./services/divisionRecord');
        require('./services/accountRecord');
        require('./services/campaignRecord');
        require('./services/creativeRecord');
        require('./services/placementRecord');
        require('./services/clientPublisherRecord');
        require('./services/industry');
        require('./services/tags');
        require('./services/enums');
        require('./services/clientSet');
        require('./services/divisionSet');
        require('./services/apiURIGenerator');
        require('./services/studioLocation');
        require('./services/cdnLocation');
        require('./services/dataSync');
    }
});
