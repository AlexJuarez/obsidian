define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');

    app.directive('tableHeader', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, rootElement, attrs) {
                var header = scope.$eval(attrs.tableHeader);
                var element;

                if (ng.isObject(header) && header.template) {
                    element = ng.element(header.template);
                    ng.extend(scope, header.locals);
                } else {
                    element = ng.element(header);
                }

                $compile(element)(scope);
                rootElement.append(element);
            }
        };
    }]);
});
