/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('app');
    require('routes');

    require(['domReady!'], function () {
        ng.bootstrap(window.document.querySelector('body'), ['app']);
    });
});
