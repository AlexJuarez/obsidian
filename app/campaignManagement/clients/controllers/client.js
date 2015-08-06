define(function (require) {
    'use strict';

    var app = require('./../../module');

    require('tpl!./../new-edit-client.html');

    app.controller('clientCtrl', ['$scope', '$modal', 'navbarService', function ($scope, $modal, navbar) {

        $scope.openEditClientModal = openEditClientModal;

        function updateClientName() {
            $scope.client = navbar.all().client;
        }

        navbar.observe(updateClientName, $scope);

        var createModal;
        function openEditClientModal() {
            if (!createModal) {
                createModal = {
                    clientId: $scope.client.id,
                    action: 'Edit'
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
