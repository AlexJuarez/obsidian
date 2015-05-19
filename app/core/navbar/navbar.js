/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./navbar.html');

    app.directive('navbar', [function () {
        return {
            restrict: 'A',
            templateUrl: 'core/navbar/navbar.html',
            replace: true,
            scope: {
                open: '='
            }
        };
    }]);
});
