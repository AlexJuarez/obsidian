/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('ui-router');

    return ng.module('app.core', ['ng', 'ui.router']);
});
