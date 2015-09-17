// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('campaignsCtrl', ['$scope', '$state', 'campaignService', 'accountService', 'campaignsByStatus', 'campaignsByAccount', '$timeout', function ($scope, $state, campaigns, accounts, campaignsByStatus, campaignsByAccount, $timeout) {
        //Needed for viewBy query Parameter
        $scope.params = $state.params;
        $scope.filter = '';
        campaignsByStatus.clearFilter();
        campaignsByAccount.clearFilter();

        $scope.filterBy = filterBy;
        $scope.clearFilter = clearFilter;
        $scope.updateFilters = updateFilters;

        console.log( campaigns.all() );


        accounts.observe(function() {
            updateFilters($scope.filter);
        }, $scope, true);

        campaigns.observe(function() {
            updateFilters($scope.filter);
        }, $scope, true);

        function filterBy(result) {
            campaignsByStatus.setFilter(result);
            campaignsByAccount.setFilter(result);
            $scope.filter = result.name;
            $scope.results = [];

            $timeout(function() {
                $scope.$apply();
            });
        }

        function clearFilter() {
            campaignsByStatus.clearFilter();
            campaignsByAccount.clearFilter();

            $scope.filter = '';
            $scope.results = [];

            $timeout(function() {
                $scope.$apply();
            });
        }

        function updateFilters(filter){
            var results = [];
            var i;

            if (filter && filter.trim()) {
                results.concat(campaigns.search(filter));

                //Add _type property for the filterBy function
                for (i = 0; i < results.length; i++) {
                    results[i]._type = "campaign";
                }

                if (!$state.params.accountId) {
                    var accountResults = accounts.search(filter);

                    for (i = 0; i < accountResults.length; i++) {
                        accountResults[i]._type = "account";
                    }
                    results = results.concat(accountResults);
                }

                results.sort(function(a, b) {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                });
            }


            if(!ng.equals(results, $scope.results)) {
                $scope.results = results;
                $timeout(function() {
                    $scope.$apply();
                })
            }
        }
    }]);
});
