define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('interpolate', ['$interpolate', function ($interpolate) {
        return function (input, scope) {
            if (input) {
                return $interpolate(input)(scope);
            }
        };
    }]);
});
