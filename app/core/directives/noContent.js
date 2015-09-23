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

                    return results.every(function (d) {
                        return d;
                    });
                }

                function updatePlacementMsg() {
                    if ( placements.data().isLoaded() ) {
                        var data = placements.all(true);
                        $scope.showPlacementMsg = hasContent(data);
                    }
                }

                function updateCreativeMsg() {
                    if ( creatives.data().isLoaded() ) {
                        var data = creatives.all().data;
                        console.log( 'creatives', data );
                        $scope.showCreativeMsg = hasContent(data);
                    }
                }

                function updateAccountMsg() {
                    console.log( 'updateAccountMsg' );
                    if ( campaignsHeader.data().isLoaded() ) {
                        var data = campaignsHeader.all();
                        console.log( 'data',data );
                        $scope.showCampaignMsg = hasContent(data);
                    }
                }

                function updateDivisionMsg() {
                    console.log( 'updateDivisionMsg' );
                    if ( divisionSet.data().isLoaded() ) {
                        var data = divisionSet.all().countAccounts;
                        var dataObj = {data};
                        $scope.showAccountMsg = hasContent(dataObj);
                    }
                    // if ( campaignsHeader.data().isLoaded() ) {
                    //     var data = campaignsHeader.all();
                    //     $scope.showCampaignMsg = hasContent(data);
                    // }
                }

                function updateClientMsg() {
                    if ( clientSet.data().isLoaded() ) {
                        var data = clientSet.all().countAccounts;
                        var dataObj = {data};
                        $scope.showAccountMsg = hasContent(dataObj);
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
                        console.log( 'at division' );
                        divisionSet.observe(updateDivisionMsg, $scope);
                    
                    } else {
                        
                        clientSet.observe(updateClientMsg, $scope);
                    
                    }
                }



            }]
        };
    }]);
});
