define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('tab', [function () {
        var uniqueId = 1;
        return {
            restrict: 'E',
            templateUrl: 'core/directives/tab.html',
            scope: {},
            link: function ($scope, elem, attr) {
                $scope.uniqueId = uniqueId++;
                $scope.selected = attr.selected === '';
                $scope.name = attr.name;
                $scope.templateUrl = attr.templateUrl;
            }
        };
    }]);
});
