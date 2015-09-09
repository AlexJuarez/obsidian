define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');

    app.filter('truncateNumber', [function () {
        return function (input) {
            if (!ng.isNumber(input)) {
                return 0;
            }
            if (input < 1000) {
                return input;
            }
            if (Math.round(input/100)/10 < 1000) {
                return Math.round(input / 100) / 10 + 'K';
            }
            if (Math.round(input / 100000) / 10 < 1000) {
                return Math.round(input / 100000) / 10 + 'M';
            }
            if (Math.round(input / 100000000) / 10 < 1000) {
                return Math.round(input / 100000000) / 10 + 'B';
            }
            return input;
        };
    }]);
});
