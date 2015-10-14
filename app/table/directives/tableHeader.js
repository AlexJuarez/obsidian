define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');

    app.directive('tableHeader', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, rootElement, attrs) {
                var element;
                scope.$watch(attrs.tableHeader, function(val) {
                    if (element) {
                        element.remove();
                        element = null;
                    }

                    if (ng.isObject(val) && val.template) {
                        element = ng.element(val.template);
                        ng.extend(scope, val.locals);
                    } else {
                        element = ng.element(val);
                    }

                    $compile(element)(scope);
                    rootElement.append(element);
                }, true);
            }
        };
    }]);
});
