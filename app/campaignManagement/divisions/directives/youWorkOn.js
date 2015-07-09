define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./youWorkOn.html');

    app.directive('youWorkOn', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/divisions/directives/youWorkOn.html',
            controller: ['$scope', '$state', 'clientSet', 'divisionSet', function ($scope, $state, clientSet, divisionSet) {
                function updateSummaryClientSet() {
                    $scope.summary = clientSet.all();
                }

                function updateSummaryDivisionSet() {
                    $scope.summary = divisionSet.all();
                }

                if ($state.params.divisionId) {
                    divisionSet.observe(updateSummaryDivisionSet, $scope);
                } else {
                    clientSet.observe(updateSummaryClientSet, $scope);
                }
            }]
        };
    }]);
});
