/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ng-perfect-scrollbar');
    require('ui-router');
    require('ng-datepicker');
    require('./chart/index');
    require('./table/index');
    require('./core/index');
    require('./style-guide/index');
    require('./campaignManagement/index');
    require('./analytics/index');

    return ng.module('app', [
        'ui.bootstrap.datepicker',
        'perfect_scrollbar',
        'app.home',
        'app.campaign-management',
        'app.analytics',
        'tpl',
        'ui.router'
    ]);
});
