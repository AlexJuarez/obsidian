define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaignsByStatus.html');

    app.directive('campaignsByStatus', [function () {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/campaignsByStatus.html',
            controller: ['$scope', 'campaignsByStatus', function ($scope, campaignsByStatus) {

                function updateByStatus() {
                    $scope.byStatus = campaignsByStatus.all();
                }

                campaignsByStatus.observe(updateByStatus, $scope);
            }]
        };
    }]);
});
