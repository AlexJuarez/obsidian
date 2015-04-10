/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');
    require('./home/index');

    return ng.module('app', [
        'app.home',
        'tpl',
        'ui.router'
    ]);
});
