define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('angular-chosen');
    require('ng-perfect-scrollbar');
    require('ng-datepicker');
    require('./core/index');
    require('./table/index');
    require('./chart/index');
    require('./campaignManagement/index');
    require('./analytics/index');

    return ng.module('app', [
        'ui.bootstrap.datepicker',
        'perfect_scrollbar',
        'app.campaign-management',
        'app.analytics',
        'localytics.directives',
        'tpl',
        'app.core',
        'app.tables',
        'app.charts',
        'ui.router'
    ]);
});
