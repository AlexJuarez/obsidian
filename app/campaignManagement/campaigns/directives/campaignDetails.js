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
            controller: ['$scope', '$state', '$http', '$timeout', 'dataFactory', function ($scope, $state, $http, $timeout, dataFactory) {
                var campaignID = $state.params.campaignId;

                $scope.showCampaignDetails = showCampaignDetails;

                $scope.details = {
                    metrics: {
                        impressions: 0,
                        bookedImpressions: 0
                    },
                    distinctPublishers: 0,
                    countCreatives: 0,
                    countPlacements: 0
                };

                showCampaignDetails(campaignID);

                function showCampaignDetails(campaignId) {
                    var apiConfig = {
                        endpoint: 'campaigns',
                        queryParams: {
                            dimensions: [
                                'status', 'startDate', 'endDate',
                                'distinctPublishers', 'countPlacements',
                                'countCreatives'
                            ],
                            metrics: ['impressions', 'bookedImpressions'],
                            filters: ['id:eq:' + campaignId]
                        }
                    };
                    var data = dataFactory();
                    data.init(apiConfig);

                    data.observe(function() {
                        var res = data.all();
                        if (res.campaigns && res.campaigns.length) {
                            $timeout(function () {
                                $scope.details = res.campaigns[0];
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
                        }
                    }, $scope, false);
                }


            }]
        };
    }]);
});
