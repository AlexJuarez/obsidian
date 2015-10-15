define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');
    require('tpl!./accordionTable.html');

    app.directive('accordionTable', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/accordionTable.html',
            replace: true,
            transclude: true,
            scope: {
                table: '=accordionTable',
                classes: '@class'
            },
            link: function (scope) {

                var opened = false;

                scope.init = init;

                function init(length, s){
                    if (length && !opened) {
                        s.open = opened = true;
                    }
                }

                if (ng.isArray(scope.table)) {
                    scope.$watchCollection('table', function(val) {
                        scope.table = val;
                        $timeout(function() {
                            scope.$apply();
                        });
                    }, true);
                } else {
                    scope.$watch('table', function(val) {
                        scope.table = val;
                        $timeout(function() {
                            scope.$apply();
                        });
                    }, true);
                }
            }
        };
    }]);
});
