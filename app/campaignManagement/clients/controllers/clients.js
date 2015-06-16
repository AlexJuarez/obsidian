'use strict';

define(function (require) {
    var app = require('./../../module');
    require('tpl!./../new-client.html');

    app.controller('clientsCtrl', ['$scope', '$http', '$timeout', 'topClientsService', '$modal', function ($scope, $http, $timeout, topClients, $modal) {

        $scope.openModal = openModal;

        topClients.init('/api/v3/clients?dimensions=id,name,channel,lastViewedUserDate,lastViewedUserName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions:desc&limit=10');

        topClients.observe(updateTopClients, $scope);

        function updateTopClients() {
            $scope.topClients = topClients.all();
        }

        function openModal(size) {
            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/clients/new-client.html',
                controller: 'newClientCtrl',
                size: size
            });
        }
    }]);
});
