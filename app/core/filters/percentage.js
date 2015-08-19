define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('percentage', [function () {
        return function (input) {
            var roundedNum = input * 100;
            return roundedNum.toFixed(2);
        };
    }]);
});
