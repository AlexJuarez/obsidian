define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('campaignDropdown', ['campaignService', '$timeout', function (campaigns, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = campaigns.pin;
                $scope.unpin = campaigns.unpin;
                $scope.transition = transition;

                campaigns.observe(update);

                function transition(campaignId) {
                    if (window.Router) {
                        window.Router.router.transitionTo('campaign-management.campaign.index', {campaignId: campaignId});
                    }
                }

                function update() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.quarterMap = campaigns.quarterMap();
                            $scope.pinned = campaigns.pinned();
                            $scope.inFlight = campaigns.inFlight();
                            $scope.preFlight = campaigns.preFlight();
                            $scope.completed = campaigns.completed();
                        });
                    });
                }
            }]
        };
    }]);
});
