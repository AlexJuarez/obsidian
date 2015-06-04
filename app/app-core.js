define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('angular-chosen');
    require('ng-datepicker');
    require('ng-perfect-scrollbar');
    require('./core/index');
    require('./table/index');
    require('./chart/index');
    require('./campaignManagement/index');

    return ng.module('app', [
        'datePicker',
        'perfect_scrollbar',
        'app.campaign-management',
        'localytics.directives',
        'tpl',
        'app.core',
        'app.tables',
        'app.charts',
        'ui.router'
    ]);
});
