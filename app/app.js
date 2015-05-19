/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('angular-chosen');
    require('ng-perfect-scrollbar');
    require('ui-router');
    require('./chart/index');
    require('./table/index');
    require('./core/index');
    require('./style-guide/index');
    require('./campaign-management/index');


    return ng.module('app', [
        'perfect_scrollbar',
        'localytics.directives',
        'app.home',
        'app.campaign-management',
        'tpl',
        'ui.router'
    ]);
});
