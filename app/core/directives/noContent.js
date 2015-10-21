define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./noContent.html');

    app.directive('noContent', [function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                clickAction: '='
            },
            templateUrl: 'core/directives/noContent.html',
            controller: ['$rootScope', '$scope', '$state', '$timeout', 'clientSet', 'divisionSet', 'campaignsHeader', 'creatives', 'placements', function ($rootScope, $scope, $state, $timeout, clientSet, divisionSet, campaignsHeader, creatives, placements) {

                $scope.showAccountMsg = false;
                $scope.showDivisionMsg = false;
                $scope.showCampaignMsg = false;
                $scope.showCreativeMsg = false;
                $scope.showPlacementMsg = false;

                assignObserver();

                function assignObserver() {
                    if ($state.params.campaignId) {

                        if ($state.current.name === 'cm.campaigns.detail.placements') {
                            placements.observe(updatePlacementMsg, $scope);
                            $scope.openNewPlacementModal = $scope.clickAction;
                        }
                        if ($state.current.name === 'cm.campaigns.detail.creatives') {
                            creatives.observe(updateCreativeMsg, $scope);
                            $scope.openNewCreativeModal = $scope.clickAction;
                        }

                    } else if ($state.params.accountId) {

                        campaignsHeader.observe(updateAccountMsg, $scope);
                        $scope.openNewCampaignModal = $scope.clickAction;

                    } else if ($state.params.divisionId) {

                        divisionSet.observe(updateDivisionMsg, $scope);
                        $scope.openNewAccountModal = $scope.clickAction;

                    } else if ($state.params.clientId) {

                        clientSet.observe(updateClientMsg, $scope);

                    }
                }

                function updateCreativeMsg() {
                    if ( creatives.data().isLoaded() ) {
                        $scope.showCreativeMsg = creatives.noContent();
                    }
                }

                function updatePlacementMsg() {
                    if ( placements.data().isLoaded() ) {
                        $scope.showPlacementMsg = placements.noContent();
                    }
                }

                function updateAccountMsg() {
                    if ( campaignsHeader.data().isLoaded() ) {
                        $scope.showCampaignMsg = campaignsHeader.noContent();
                    }
                }

                function updateDivisionMsg() {
                    if ( divisionSet.data().isLoaded() ) {
                        $scope.showAccountMsg = !divisionSet.all().countAccounts;
                    }
                }

                function updateClientMsg() {

                    if ( clientSet.data().isLoaded() ) {
                        $scope.showDivisionMsg = !clientSet.all().countDivisions;
                        $scope.openNewDivisionModal = $scope.clickAction;

                        // If has divisions, check for no accounts
                        if (!$scope.showDivisionMsg) {
                            $scope.showAccountMsg = !clientSet.all().countAccounts;
                            $scope.openNewAccountModal = $scope.clickAction;
                        }
                    }

                }

            }]
        };
    }]);
});
