/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';

    var ng = require('angular');
    require('app-core');

    require(['domReady!'], function (document) {
        ng.bootstrap(document, ['app']);
    });
});
