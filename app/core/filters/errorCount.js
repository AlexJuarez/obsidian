define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('errorCount', [function () {
        return function (input) {
            var count = 0;
            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    count++;
                }
            }
            switch (count) {
            case 1:
                return 'one';
            case 2:
                return 'two';
            case 3:
                return 'three';
            default:
                return count;
            }
        };
    }]);
});
