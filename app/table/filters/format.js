define(function (require) {
    'use strict';

    var app = require('./../module');
    //var ng = require('angular');

    app.filter('format', ['$filter', function ($filter) {
        function percent(input) {
            return $filter('number')(input, 2) + '%';
        }

        function date(input) { // input: 2015-04-01T12:00:00Z -> Longdate: April 1, 2015
            return $filter('date')(input, 'longDate');
        }

        return function (input, row, rules) {
            var rule = rules[input];
            input = row[input];
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
            case 'link':
                return '<a ui-sref="' + input.route + '">' + input.name + '</a>';
            default:
                return input;
            }
        };
    }]);
});
