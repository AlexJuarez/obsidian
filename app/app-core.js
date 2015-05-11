define(function (require) {
    'use strict';

    var ng = require('angular');
    require('angular-chosen');
    require('./core/index');
    require('./table/index');
    require('./chart/index');

    return ng.module('app', [
        'localytics.directives',
        'tpl',
        'app.core',
        'app.tables',
        'app.charts'
    ]);
});
