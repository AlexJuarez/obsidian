define(function (require) {
    'use strict';

    var ng = require('angular');
    require('angular-chosen');
    require('ng-perfect-scrollbar');
    require('./core/index');
    require('./table/index');
    require('./chart/index');

    return ng.module('app', [
        'perfect_scrollbar',
        'localytics.directives',
        'tpl',
        'app.core',
        'app.tables',
        'app.charts'
    ]);
});
