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
            controller: ['$scope', 'clientSet', function ($scope, activeSummary) {
                function updateSummary() {
                    $scope.summary = activeSummary.all();
                }

                activeSummary.observe(updateSummary, $scope);
            }]
        };
    }]);
});
