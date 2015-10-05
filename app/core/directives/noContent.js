define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');
    require('tpl!./noContent.html');

    app.directive('noContent', [function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {},
            templateUrl: 'core/directives/noContent.html',
            controller: ['$rootScope', '$scope', '$state', '$timeout', 'clientSet', 'divisionSet', 'campaignsHeader', 'creatives', 'placements', function ($rootScope, $scope, $state, $timeout, clientSet, divisionSet, campaignsHeader, creatives, placements) {
                
                $scope.showAccountMsg = false;
                $scope.showCampaignMsg = false;
                $scope.showCreativeMsg = false;
                $scope.showPlacementMsg = false;

                assignObserver();

                function assignObserver() {
                    if ($state.params.campaignId) {
                        
                        if ($state.current.url === '/placements') {
                            placements.observe(updatePlacementMsg, $scope);
                        }
                        if ($state.current.url === '/thumbnails' || $state.current.url === '/list') {
                            creatives.observe(updateCreativeMsg, $scope);
                        }
                        
                    
                    } else if ($state.params.accountId) {

                        campaignsHeader.observe(updateAccountMsg, $scope);
                    
                    } else if ($state.params.divisionId) {

                        divisionSet.observe(updateDivisionMsg, $scope);
                    
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
                        $scope.showAccountMsg = !clientSet.all().countAccounts;
                    }
                    
                }

            }]
        };
    }]);
});
