'use strict';

define(function (require) {
    var app = require('./../../module');
    require('tpl!./../new-client.html');

    app.controller('clientsCtrl', ['$scope', 'topClientsService', '$modal', function ($scope, topClients, $modal) {

        $scope.openModal = openModal;

        topClients.init();

        topClients.observe(updateTopClients, $scope);

        function updateTopClients() {
            $scope.topClients = topClients.all();
        }

        var createModal;
        function openModal() {
            if (!createModal) {
                createModal = {};
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/clients/new-client.html',
                controller: 'newClientCtrl',
                resolve: {
                    modalState: function() {
                        return createModal;
                    }
                },
                size: 'lg'
            });
        }
    }]);
});
