'use strict';

define(function (require) {
    var app = require('./../../module');
    //var ng = require('angular');

    app.controller('divisionsCtrl', ['$scope', '$http', '$timeout', '$stateParams', function ($scope, $http, $timeout, $stateParams) {
        $http.get('/api/v3/clients?filters=id:eq:' + $stateParams.clientId +
        '&dimensions=id,name&metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived').then(function (res) {
            $timeout(function () {
                $scope.youWorkOn = res.data.clients[0].metrics;
                $scope.youWorkOn.countCampaigns = $scope.youWorkOn.countCampaignsPreFlight + $scope.youWorkOn.countCampaignsInFlight;
                $scope.$apply();
            });
        });
    }]);
});
