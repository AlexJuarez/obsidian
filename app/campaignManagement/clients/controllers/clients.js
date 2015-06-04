'use strict';

define(function (require) {
    var app = require('./../../module');

    app.controller('clientsCtrl', ['$scope', '$http', '$timeout', 'topClientsService', function ($scope, $http, $timeout, topClients) {
        topClients.init('/api/v3/clients?dimensions=id,name,channel,lastViewedUserDate,lastViewedUserName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions&limit=10');

        topClients.observe(updateTopClients, $scope);

        function updateTopClients() {
            $scope.topClients = topClients.all();
        }
    }]);
});
