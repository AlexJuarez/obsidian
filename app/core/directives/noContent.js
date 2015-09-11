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
            // link: function(scope, elem, attr) {
            //     console.log( 'we', attr.section );
            // },
            controller: ['$scope', '$state', 'clientSet', 'divisionSet', 'accountRecordService', 'creativeRecordService', 'creativeService', function ($scope, $state, clientSet, divisionSet, accountRecordService, creativeRecordService, creativeService) {
                console.log('$state.params', $state );
                
                //console.log( creativeService.all() );

                // $scope.noAccounts = true;
                // $scope.noCampaigns = true;
                // $scope.noCreatives = true;
                // $scope.noPlacements = true;

                //console.log();

                function updateSummaryClientSet() {
                    $scope.summary = clientSet.all();
                    console.log( 'client summary', $scope.summary );

                    // if ($scope.summary.countAccounts >= 1) {
                    //     $scope.noAccounts = false;
                    // }
                    
                }

                function updateSummaryDivisionSet() {
                    $scope.summary = divisionSet.all();
                    console.log( 'division summary', $scope.summary );
                }

                function updateSummaryAccountSet() {
                    //$scope.summary = accountRecordService.all();
                    console.log( 'account summary', $scope.summary );
                }

                // function updateSummaryCreativeSet() {
                //     $scope.summary = creativeRecordService.all();
                //     console.log( 'creative summary', $scope.summary );
                // }

                if ($state.params.campaignId) {
                    
                    console.log( 'we are at campaign', $scope.summary );
                    //creativeRecordService.observe(updateSummaryCreativeSet, $scope);
                
                } else if ($state.params.accountId) {
                    
                    console.log( 'we are at account' );
                    clientSet.observe(updateSummaryClientSet, $scope);
                    //accountRecordService.observe(updateSummaryAccountSet, $scope);
                
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
