/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('./../chart/index');
    require('./../table/index');
    require('./../core/index');

    return ng.module('app.campaign-management', ['ui.router', 'app.tables', 'app.charts', 'app.core']);
});
