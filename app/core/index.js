define(function(require) {
    'use strict';

    require('./modal/index');
    require('./datepicker/index');
    require('./navbar/index');

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
    }

    function directives() {
        require('./directives/dropdown');
        require('./directives/limit');
        require('./directives/tooltip');
        require('./directives/compile');
        require('./directives/fallbackSrc');
        require('./directives/placeholder');
        require('./directives/filePicker');
        require('./directives/pacingChart');
        require('./directives/quartiles');
    }

    function filters() {
        require('./filters/safe');
        require('./filters/interpolate');
        require('./filters/errorCount');
        require('./filters/date');
        require('./filters/truncateNumber');
        require('./filters/percentage');
        require('./filters/adTypeOrder');
    }

    function services() {
        require('./services/channel');
// <<<<<<< HEAD
//         require('./services/clientSet');
//         require('./services/divisionSet');
//         require('./services/apiURIGenerator');
//         require('./services/clientRecord');
//         require('./services/creativeRecord');
//         require('./services/propertyByString');
//     }

//     require('./constants/apiURI');    

// =======
        require('./services/clientRecord');
        require('./services/divisionRecord');
        require('./services/accountRecord');
        require('./services/campaignRecord');
        require('./services/creativeRecord');
        require('./services/placementRecord');
        require('./services/industry');
        require('./services/enums');
        require('./services/clientSet');
        require('./services/divisionSet');
        require('./services/apiURIGenerator');
    }

    require('./constants/apiURI');
//>>>>>>> develop
});
