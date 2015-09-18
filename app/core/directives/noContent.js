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
                

                console.log( '---------- directive' );
                $scope.showAccountMsg = false;
                $scope.showCampaignMsg = false;
                $scope.showCreativeMsg = false;
                $scope.showPlacementMsg = false;

                assignObserver();

                function hasContent(data) {
                    console.log( 'hasContent', data );
                    var results = [];
                    ng.forEach(data, function(d) {
                        results.push(d == 0);
                    });
                    console.log( results.length );
                    if (results.length > 0) {
                        console.log( 'results' );
                        return results.every(function (d) {
                            console.log( 'd' );
                            return d;
                        });
                    }
                }

                function updatePlacementMsg() {
                    //if ( placements.data().isLoaded() ) {
                        var data = placements.all(true);
                        if (data && data.length < 1) {
                            console.log( 'placements summary', data.length );
                            $scope.showPlacementMsg = true;


                            console.log( '$scope.placementsMeta', $scope.placementsMeta );
                            // if (data.length < 1) {
                            //     $scope.showPlacementMsg = true;
                                
                            // }
                            // $scope.showCreativeMsg = hasContent(data);
                            // console.log( 'showCreativeMsg', $scope.showCreativeMsg );

                        }
                    //}
                }

                function updateCreativeMsg() {
                    if ( creatives.data().isLoaded() ) {
                        var data = creatives.all();
                        console.log( 'creatives summary', data );
                        if (data.data.length < 1) {
                            $scope.showCreativeMsg = true;
                        }
                        //$scope.showCreativeMsg = hasContent(data);
                        console.log( 'showCreativeMsg', $scope.showCreativeMsg );
                    }
                }

                function updateAccountMsg() {
                    if ( campaignsHeader.data().isLoaded() ) {
                        var data = campaignsHeader.all();
                        console.log( 'campaignsHeader summary', data );
                        $scope.showCampaignMsg = hasContent(data);
                    }
                }

                function updateClientMsg() {
                    if ( clientSet.data().isLoaded() ) {
                        var data = clientSet.all();
                        console.log( 'clientSet summary', data.countAccounts );
                        $scope.showAccountMsg = hasContent(data.countAccounts);
                    }
                }
                


                function assignObserver() {
                    if ($state.params.campaignId) {
                        
                        console.log( '---------- we are at campaign', $state.current.url );
                        
                        if ($state.current.url === '/placements') {
                            placements.observe(updatePlacementMsg, $scope);
                        }
                        if ($state.current.url === '/thumbnails' || $state.current.url === '/list') {
                            creatives.observe(updateCreativeMsg, $scope);
                        }
                        
                    
                    } else if ($state.params.accountId) {

                        console.log( '--------- we are at account' );
                        campaignsHeader.observe(updateAccountMsg, $scope);
                        
                    
                    } else if ($state.params.divisionId) {
                        
                        console.log( '--------- we are at division' );
                        divisionSet.observe(updateAccountMsg, $scope);
                    
                    } else {
                        
                        console.log( '--------- we are at client' );
                        clientSet.observe(updateClientMsg, $scope, false);
                    
                    }
                }



            }]
        };
    }]);
});
