define(function (require) {
    'use strict';

    var app = require('./../module');
    var ng = require('angular');
    require('tpl!./noContent.html');

    app.directive('noContent', [function () {
        return {
            restrict: 'A',
            replace: false,
            scope: true,
            templateUrl: 'core/directives/noContent.html',
            controller: ['$rootScope', '$scope', '$state', '$timeout', 'clientSet', 'divisionSet', 'campaignsHeader', 'creatives', 'placements', function ($rootScope, $scope, $state, $timeout, clientSet, divisionSet, campaignsHeader, creatives, placements) {
                

                $scope.showAccountMsg = false;
                $scope.showCampaignMsg = false;
                $scope.showCreativeMsg = false;
                $scope.showPlacementMsg = false;

                assignObserver();

                function hasContent(data) {
                    var results = [];
                    ng.forEach(data, function(d) {
                        results.push(d == 0);
                    });
                    if (results.length > 0) {
                        return results.every(function (d) {
                            return d;
                        });
                    }
                }

                function updatePlacementMsg() {
                    if ( placements.data().isLoaded() ) {
                        var data = placements.all(true);
                        if (data.length < 1) {
                            $scope.showPlacementMsg = true;

                        }
                    }
                }

                function updateCreativeMsg() {
                    if ( creatives.data().isLoaded() ) {
                        var data = creatives.all();
                        if (data.data.length < 1) {
                            $scope.showCreativeMsg = true;
                        }
                    }
                }

                function updateAccountMsg() {
                    if ( campaignsHeader.data().isLoaded() ) {
                        var data = campaignsHeader.all();
                        $scope.showCampaignMsg = hasContent(data);
                    }
                }

                function updateClientMsg() {
                    if ( clientSet.data().isLoaded() ) {
                        var data = clientSet.all();
                        $scope.showAccountMsg = hasContent(data.countAccounts);
                    }
                }
                


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
                        
                        divisionSet.observe(updateAccountMsg, $scope);
                    
                    } else {
                        
                        clientSet.observe(updateClientMsg, $scope, false);
                    
                    }
                }



            }]
        };
    }]);
});
