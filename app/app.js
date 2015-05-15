/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('angular-chosen');
    require('ui-router');
    require('./chart/index');
    require('./table/index');
    require('./core/index');
    require('./style-guide/index');

    return ng.module('app', [
        'localytics.directives',
        'app.home',
        'tpl',
        'ui.router'
    ]);
});
