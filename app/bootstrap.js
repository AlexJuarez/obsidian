/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    var app = require('app');
    require('routes');

    app.config(['$interpolateProvider', function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }]);

    require(['domReady!'], function () {
        ng.bootstrap(window.document.querySelector('body'), ['app']);
    });
});
