define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('limit', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attr) {
                scope.limit = parseInt(attr.limit);
                scope.more = more;

                function more(){
                    scope.limit += 10;
                    $timeout(function () {
                        scope.$apply();
                    });
                }
            }
        };
    }]);
});
