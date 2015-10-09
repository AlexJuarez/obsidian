'use strict';

define(function (require) {
    var app = require('./../../module');
    require('tpl!./../new-edit-client.html');

    app.controller('clientsCtrl', ['$scope', 'topClientsService', '$modal', function ($scope, topClients, $modal) {

        $scope.openNewClientModal = openNewClientModal;
        $scope.clientsAreLoaded = false;
        $scope.showLoader = false;

        // Show spinner if data not loaded
        if ( !topClients.isLoaded() ) {
            $scope.showLoader = true;
        }

        topClients.init();

        topClients.observe(updateTopClients, $scope);

        function updateTopClients() {
            $scope.topClients = topClients.all();
            
            // Stop the loading spinner if data loaded
            if ( topClients.isLoaded() ) {
                $scope.clientsAreLoaded = true;
            }
        }

        var createModal;
        function openNewClientModal() {
            if (!createModal) {
                createModal = {
                    action: 'New'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/clients/new-edit-client.html',
                controller: 'newEditClientCtrl',
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
