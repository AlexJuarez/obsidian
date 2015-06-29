define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('tabs', ['$compile', function ($compile) {
        var uniqueId = 1;
        return {
            restrict: 'E',
            require: 'templateUrl',
            templateUrl: 'core/directives/tab.html',
            scope: {},
            link: function ($scope, elem, attr) {
                debugger;
                $scope.uniqueId = uniqueId++;
                $scope.templateUrl = attr.templateUrl;
            }
        };
    }]);
});
