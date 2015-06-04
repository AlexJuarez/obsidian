// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$http', '$timeout', 'campaignsByStatus', 'navbarService', function ($scope, $http, $timeout, campaignsByStatus, navbarService) {
        $scope.byStatus = [];

        var statuses = {
            preFlight: 'Pre-Flight',
            inFlight: 'In-Flight',
            completed: 'Completed',
            archived: 'Archived'
        };

        function updateByStatus() {
            $scope.byStatus = campaignsByStatus.all();
        }

        campaignsByStatus.observe(updateByStatus, $scope);
    }]);
});
