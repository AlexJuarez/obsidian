define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('compile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                scope.$watch(
                    function (scope) {
                        return scope.$eval(attr.compile);
                    },
                    function (value) {
                        elem.html(value);
                        $compile(elem.contents())(scope);
                    }
                );
            }
        };
    }]);
});
