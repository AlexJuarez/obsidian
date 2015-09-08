define(function (require) {
    'use strict';

    var app = require('./../module');

    app.filter('percentage', [function () {
        return function (input) {
            
            if (input < 1) {
                var roundedNum = input * 100;
                return roundedNum.toFixed(2);   
            } else {
                return input;
            }
            
        };
    }]);
});
