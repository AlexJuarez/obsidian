define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('errorCount', [function () {
        return function (input) {
            var count = 0;
            for (var k in input) {
                if (input.hasOwnProperty(k)) {
                    count += input[k].length || 1;
                }
            }
            return count;
        };
    }]);
});
