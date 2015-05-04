define(function (require) {
    'use strict';

    var ng = require('angular');
    require('./chart/index');
    require('./table/index');
    require('./core/index');

    return ng.module('app', [
        'app.core',
        'app.tables',
        'app.charts',
        'tpl'
    ]);
});
