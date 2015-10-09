define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./activeSummary.html');

    app.directive('activeSummary', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/clients/directives/activeSummary.html',
            controller: ['$scope', 'clientSet', function ($scope, activeSummary) {
                function updateSummary() {
                    $scope.active = activeSummary.all();
                    
                }

                activeSummary.observe(updateSummary, $scope, true);
            }]
        };
    }]);
});
