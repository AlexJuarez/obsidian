define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaignDetails.html');

    app.directive('campaignDetails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/campaignDetails.html',
            controller: ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
                var campaignID = $state.params.campaignId;
                $http.get('/api/v3/campaigns?dimensions=status,startDate,endDate,distinctPublishers,countPlacements,countCreatives&metrics=impressions,bookedImpressions&filters=id:' + campaignID)
                .then(function (res) {
                    $timeout(function () {
                        $scope.details = res.data.campaigns[0];
                        $scope.showImpressions = false;
                        $scope.isLive = false;
                        switch ($scope.details.status) {
                        case 'preFlight':
                            $scope.campaignStatus = 'Pre-Flight';
                            break;
                        case 'inFlight':
                            $scope.campaignStatus = 'In-Flight';
                            $scope.showImpressions = true;
                            $scope.isLive = true;
                            break;
                        case 'live':
                            $scope.campaignStatus = 'Live';
                            $scope.showImpressions = true;
                            $scope.isLive = true;
                            break;
                        case 'completed':
                            $scope.campaignStatus = 'Completed';
                            $scope.showImpressions = true;
                            break;
                        case 'archived':
                            $scope.campaignStatus = 'Archived';
                            $scope.showImpressions = true;
                            break;
                        default:
                            $scope.campaignStatus = 'Unknown';
                        }
                        $scope.$apply();
                    });
                });

            }]
        };
    }]);
});
