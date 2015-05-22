'use strict';

define(function (require) {
    var app = require('./../../module');
    //var ng = require('angular');

    app.controller('clientCtrl', ['$scope', '$http', '$timeout', '$stateParams', 'navbarService', function ($scope, $http, $timeout, $stateParams, navbar) {

        $http.get('/narwhal/clients?filters=client.id:eq:' + $stateParams.id +
        '&dimensions=id,name&metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived').then(function (res) {
            $timeout(function () {
                $scope.youWorkOn = res.data.clients[0].metrics;
                $scope.youWorkOn.countCampaigns = $scope.youWorkOn.countCampaignsPreFlight + $scope.youWorkOn.countCampaignsInFlight;
                $scope.$apply();
            });
        });

        navbar.setClient($stateParams.id);
        console.log($stateParams.id + '', navbar.all());
    }]);
});
