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
            controller: ['$scope', '$state', '$timeout', 'clientSet', 'divisionSet', 'campaignsHeader', function ($scope, $state, $timeout, clientSet, divisionSet, campaignsHeader) {
                console.log('$state.params', $state );
                

                function reset() {
                    console.log( 'reset vars' );
                    $scope.showAccountMsg = false;
                    $scope.showCampaignMsg = false;
                    $scope.showCreativeMsg = false;
                    $scope.showPlacementMsg = false;

                }


                function updateSummaryCampaignsHeader() {
                    reset();
                    $scope.campaignSummary = campaignsHeader.all();
                    console.log( 'campaignsHeader summary', $scope.campaignSummary );
                    //$scope.clientSummary = clientSet.all();
                    //console.log( 'clientSummary summary', $scope.clientSummary );

                    if ($scope.campaignSummary.preFlight === 0 && $scope.campaignSummary.inFlight === 0 && $scope.campaignSummary.completed === 0 && $scope.campaignSummary.archived === 0) {
                        $scope.showCampaignMsg = true;
                    }
                }

                
                
                function updateSummaryClientSet() {
                    reset();
                    console.log( 'updateSummaryClientSet' );
                    $scope.clientSummary = clientSet.all();
                    console.log( 'client summary', $scope.clientSummary );

                    if ($scope.clientSummary.countAccounts === 0 && $scope.clientSummary.count !== 0) {
                        $scope.showAccountMsg = true;
                    }

                    
                }

                function updateSummaryDivisionSet() {
                    console.log( 'updateSummaryDivisionSet' );
                    $scope.summary = divisionSet.all();
                    console.log( 'division summary', $scope.summary );
                    
                    if ($scope.summary.countAccounts === 0 && $scope.summary.count !== 0) {
                        $scope.showAccountMsg = true;
                    }

                }
                

                if ($state.params.campaignId) {
                    
                    console.log( 'we are at campaign' );
                    
                    //clientSet.observe(updateSummaryClientSet, $scope);
                
                } else if ($state.params.accountId) {
                    
                    console.log( 'we are at account' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                    campaignsHeader.observe(updateSummaryCampaignsHeader, $scope);
                    
                
                } else if ($state.params.divisionId) {
                    
                    console.log( 'we are at division' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                    divisionSet.observe(updateSummaryDivisionSet, $scope);
                
                } else {
                    
                    console.log( 'we are at client' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                
                }


            }]
        };
    }]);
});
