define(function (require) {
    'use strict';

    var ng = require('angular');
    require('./core/index');
    require('./table/index');
    require('./chart/index');

    return ng.module('app', [
        'tpl',
        'app.core',
        'app.tables',
        'app.charts'
    ]);
});
