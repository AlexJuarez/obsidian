define(function (require) {
    'use strict';

    var app = require('./module');
    //var ng = require('angular');

    app.filter('format', ['$filter', function ($filter) {
        function percent(input) {
            return $filter('number')(input, 2) + '%';
        }

        function date(input) {
            return $filter('date')(input, 'longDate');
        }

        return function (input, key, rules) {
            input = input || '';
            var rule = rules[key];
            switch (rule) {
            case 'number':
                return $filter('number')(input, 0);
            case 'percent':
                return percent(input);
            case 'quartile':
                return input.map(function (d) {
                    return percent(d);
                }).join(' ');
            case 'date':
                return date(input);
            case 'bullet':
                return '';
            default:
                return input;
            }
        };
    }]);
});
