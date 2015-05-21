define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('truncateNumber', [function () {
        return function (input) {
            if (input < 1000) {
                return input;
            }
            if (input < 1000000) {
                return Math.round(input / 100) / 10 + 'K';
            }
            if (input < 1000000000) {
                return Math.round(input / 100000) / 10 + 'M';
            }
            return input;
        };
    }]);
});
