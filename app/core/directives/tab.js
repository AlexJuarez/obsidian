define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('tab', ['$compile', function ($compile) {
        var uniqueId = 1;
        return {
            restrict: 'E',
            //require: ['name'],
            templateUrl: 'core/directives/tab.html',
            scope: {},
            link: function ($scope, elem, attr) {
                $scope.uniqueId = uniqueId++;
                $scope.name = attr.name;
                $scope.templateUrl = attr.templateUrl;
            }
        };
    }]);
});
