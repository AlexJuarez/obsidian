// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$http', '$timeout', 'campaignsByStatus', 'navbarService', function ($scope, $http, $timeout, campaignsByStatus, navbarService) {
        $scope.byStatus = {};
        var filterType;
        var filterId;

        //navbarService.observe(function() {
        //    debugger;
        //    var big = navbarService.all();
        //}, $scope);

        for(var status in campaignsByStatus) {
            (function(status) {
                var accordionTable = campaignsByStatus[status];
                $scope.byStatus[status] = {};

                // After the header and rows data has returned, set that data on the scope
                accordionTable.allReady.then(function () {
                    accordionTable.observeRows(function() {
                        $scope.byStatus[status].data = accordionTable.all();
                    }, $scope);
                });

                // Set up the "next page" button function on the scope
                $scope.byStatus[status].loadMore = function() {
                    accordionTable.getMoreCampaigns();
                }
            }(status))
        }
    }]);
});
