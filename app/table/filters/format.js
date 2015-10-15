define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');

    app.filter('format', ['$filter', function ($filter) {
        function percent(input) {
            return $filter('number')(input, 2) + '%';
        }

        function date(input) { // input: 2015-04-01T12:00:00Z -> Longdate: April 1, 2015
            return $filter('date')(input, 'M/d/yyyy');
        }

        function createCheckbox(data, input) {
            if (ng.isFunction(data)) {
                return '<label><input ng-click="row.' + input + '()" class="checkbox checkbox-light" type="checkbox" /><span></span></label>';
            } else {
                return '<label><input class="checkbox checkbox-light" type="checkbox" /><span></span></label>';
            }
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
                return '<div class="nowrap" data-id="row.id" data-object="row" table-icons="row.' + input + '"></div>';
            case 'quartile':
                return data.map(function (d) {
                    return percent(d);
                }).join(' ');
            case 'date':
                return date(data);
            case 'checkbox':
                return createCheckbox(data, input);
            case 'status':
                return '<span class="glyph-dot status" ng-class="{\'success\': row.' + input + '}"></span>';
            case 'bullet':
                return '<div pacing-chart="row.' + input + '"></div>';
            case 'link':
                return '<a ui-sref="' + data.route + '">' + data.name + '</a>';
            case 'creatives':
                return '<div table-creatives="row.' + input + '"></div>';
            case 'delivering':
                return '<span table-delivering delivering="row.' + input + '"></div>';
            case 'tooltip':
                return '<div class="tooltip tooltip-basic tooltip-light" tooltip-overflow="true" tooltip="\'' + data + '\'">' + data + '</div>';
            default:
                return data;
            }
        };
    }]);
});
