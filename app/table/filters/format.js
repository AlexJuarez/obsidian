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
            var data = row[input];
            switch (rule) {
            case 'number':
                return $filter('number')(data, 0);
            case 'percent':
                return percent(data);
            case 'icons':
                return '<div data-id="row.id" data-object="row" table-icons="row.' + input + '"></div>';
            case 'quartile':
                return data.map(function (d) {
                    return percent(d);
                }).join(' ');
            case 'date':
                return date(data);
            case 'bullet':
                return '<div pacing-chart="row.' + input + '" class="meter-wrapper meter-sm"></div>';
            case 'link':
                return '<a ui-sref="' + data.route + '">' + data.name + '</a>';
            case 'creatives':
                return '<div table-creatives creatives="row.' + input + '"></div>';
            case 'delivering':
                return '<span table-delivering delivering="row.' + input + '"></div>';
            default:
                return data;
            }
        };
    }]);
});
