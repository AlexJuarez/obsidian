define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('ng-datepicker');
    require('./core/index');
    require('./table/index');
    require('./chart/index');
    require('./campaignManagement/index');
    require('./analytics/index');

    return ng.module('app', [
        'ui.bootstrap.datepicker',
        'app.campaign-management',
        'app.analytics',
        'tpl',
        'app.core',
        'app.tables',
        'app.charts',
        'ui.router'
    ]);
});
