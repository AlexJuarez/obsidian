define(function (require) {
    'use strict';

    var app = require('./module');
    require('tpl!./accordion.html');

    app.directive('accordion', ['$http', function ($http) {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            templateUrl: 'table/accordion.html',
            controller: ['$scope', function ($scope) {
                $http.get('fixtures/accordion_table.json').success(function (data) {
                    $scope.rows = data;
                });
            }]
        };
    }]);
});
