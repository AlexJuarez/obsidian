define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./active.html');

    app.directive('activeSummary', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaign-management/clients/directives/active.html',
            controller: ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
                $http.get('fixtures/clients_active.json').then(function (res) {
                    $timeout(function () {
                        $scope.active = res.data.active;
                        $scope.$apply();
                    });
                });
            }]
        };
    }]);
});
