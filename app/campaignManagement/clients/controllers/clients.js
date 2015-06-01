'use strict';

define(function (require) {
    var app = require('./../../module');

    app.controller('clientsCtrl', ['$scope', '$http', '$timeout', 'topClientsService', function ($scope, $http, $timeout, topClients) {
        topClients.init('/fixtures/top_clients_table.json');

        topClients.observe(updateTopClients, $scope);

        function updateTopClients() {
            $scope.topClients = topClients.all();
        }
    }]);
});
