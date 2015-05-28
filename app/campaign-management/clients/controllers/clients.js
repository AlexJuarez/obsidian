'use strict';

define(function (require) {
    var app = require('./../../module');

    app.controller('clientsCtrl', ['$scope', '$http', '$timeout', 'topClientsService', function ($scope, $http, $timeout, topClients) {
        $scope.inFlightCampaigns = {};
        $scope.preFlightCampaigns = {};
        $scope.completeCampaigns = {};
        $scope.archivedCampaigns = {};
        $scope.topClients = {};

        topClients.init('/fixtures/top_clients_table.json');
        topClients.observe(updateTopClients);

        function updateTopClients() {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.topClients = topClients.all();
                });
            });
        }
    }]);
});
