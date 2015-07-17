// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('campaignsCtrl', ['$scope', '$state', 'campaignService', 'accountService', '$timeout', function ($scope, $state, campaigns, accounts, $timeout) {
        //Needed for viewBy query Parameter
        $scope.params = $state.params;
        $scope.filter = '';

        $scope.filterBy = filterBy;
        $scope.updateFilters = updateFilters;

        accounts.observe(function() {
            updateFilters($scope.filter);
        }, $scope, true);

        campaigns.observe(function() {
            updateFilters($scope.filter);
        }, $scope, true);

        function filterBy(result) {
            console.log(result);
        }

        function updateFilters(filter){
            var results = [].concat(accounts.search(filter), campaigns.search(filter));
            results.sort(function(a, b) {
                if (a.name && b.name) {
                    return a.name.localeCompare(b.name);
                } else {
                    return 0;
                }
            });

            if(!ng.equals(results, $scope.results)) {
                $scope.results = results;
                $timeout(function() {
                    $scope.$apply();
                })
            }
        }
    }]);
});
