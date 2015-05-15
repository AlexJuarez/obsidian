/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');

    return ng.module('app.home', ['ui.router', 'app.tables', 'app.charts', 'app.core']);
});
