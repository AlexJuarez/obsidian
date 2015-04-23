define(function (require) {
    'use strict';

    var ng = require('angular');
    require('./chart/index');
    require('./table/index');

    return ng.module('app', [
        'app.tables',
        'app.charts',
        'tpl'
    ]);
});
