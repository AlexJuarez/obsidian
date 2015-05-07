define(function (require) {
    'use strict';

    var app = require('./module');
    //var ng = require('angular');

    app.filter('interpolate', ['$interpolate', function ($interpolate) {
        return function (input) {
            return $interpolate(input);
        };
    }]);
});
