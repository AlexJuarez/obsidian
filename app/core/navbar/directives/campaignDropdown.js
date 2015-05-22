define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaign.html');

    app.directive('campaignDropdown', ['campaignService', '$timeout', 'navbarService', function (campaigns, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/campaign.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = campaigns.pin;
                $scope.unpin = campaigns.unpin;
                $scope.section = 'Campaigns';
                $scope.current = 'All Campaigns';

                campaigns.observe(update);

                navbar.observe(updateCurrent);

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.current = navbar.all().campaign || 'All Campaigns';
                        });
                    });
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
