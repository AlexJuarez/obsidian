define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('angular-chosen');
    require('ng-perfect-scrollbar');
    require('./core/index');
    require('./table/index');
    require('./chart/index');
    require('./campaign-management/index');

    return ng.module('app', [
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
