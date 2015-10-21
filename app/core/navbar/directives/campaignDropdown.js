define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaign.html');

    app.directive('campaignDropdown', ['campaignService', '$timeout', 'navbarService', function (campaigns, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/campaign.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.pin = campaigns.pin;
                $scope.unpin = campaigns.unpin;
                $scope.section = 'Campaigns';
                $scope.current = 'All Campaigns';
                $scope.state = {};
                $scope.quarterLimit = 5;
                $scope.preFlightLimit = 10;
                $scope.inFlightLimit = 10;
                $scope.completedLimit = 10;

                campaigns.observe(update, $scope);
                navbar.observe(updateCurrent, $scope);
                navbar.observe(update, $scope);

                var cleanup = $rootScope.$on('$stateChangeSuccess', function() {
                    $scope.query = '';
                });

                $scope.$on('$destroy', function() {
                    cleanup();
                });

                $scope.$watch('query', function (newValue) {
                    $scope.results = campaigns.search(newValue);
                });

                function updateCurrent() {
                    var info = navbar.all();

                    $scope.current = info.campaign && info.campaign.name || 'All Campaigns';
                    if (info.campaign && info.account && info.account.id) {
                        $scope.state = { accountId: info.account.id };
                    } else {
                        $scope.state = {};
                    }
                }

                function update(event) {
                    if (event === 'pin') {
                        $scope.pinned = campaigns.pinned();
                    } else {
                        $scope.pinned = campaigns.pinned();
                        $scope.quarterMap = campaigns.quarterMap();
                        $scope.inFlight = campaigns.inFlight();
                        $scope.preFlight = campaigns.preFlight();
                        $scope.completed = campaigns.completed();
                    }
                }
            }]
        };
    }]);
});
