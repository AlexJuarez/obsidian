define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./noContent.html');

    app.directive('noContent', [function () {
        return {
            restrict: 'A',
            replace: false,
            scope: true,
            templateUrl: 'core/directives/noContent.html',
            controller: ['$scope', '$state', '$timeout', 'clientSet', 'divisionSet', function ($scope, $state, $timeout, clientSet, divisionSet) {
                console.log('$state.params', $state );
                

                $scope.showAccountMsg = false;
                $scope.showCampaignMsg = false;
                $scope.showCreativeMsg = false;
                $scope.showPlacementMsg = false;


                function updateSummaryClientSet() {
                    console.log( 'updateSummaryClientSet' );
                    $scope.summary = clientSet.all();
                    console.log( 'client countAccounts', $scope.summary.countAccounts, $scope.showAccountMsg );

                    $timeout(function() {
                        if ($scope.summary.countAccounts === 0) {
                            $scope.showAccountMsg = true;
                            console.log( 'countAccounts is zero', $scope.showAccountMsg );
                        }

                    }, 1000);
                    
                }

                function updateSummaryDivisionSet() {
                    console.log( 'updateSummaryDivisionSet' );
                    $scope.summary = divisionSet.all();
                    console.log( 'division summary', $scope.summary );
                    
                    $timeout(function() {
                        if ($scope.summary.countAccounts === 0) {
                            $scope.showAccountMsg = true;
                            console.log( 'countAccounts is zero', $scope.showAccountMsg );
                        }

                    }, 2000);
                }
                

                if ($state.params.campaignId) {
                    
                    console.log( 'we are at campaign', $scope.summary );
                    clientSet.observe(updateSummaryClientSet, $scope);
                
                } else if ($state.params.accountId) {
                    
                    console.log( 'we are at account' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                
                } else if ($state.params.divisionId) {
                    
                    console.log( 'we are at division' );
                    divisionSet.observe(updateSummaryDivisionSet, $scope);
                
                } else {
                    
                    console.log( 'we are at client' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                
                }


            }]
        };
    }]);
});
