define(function (require) {
    'use strict';

    var app = require('./../../module');

    require('tpl!./../new-edit-client.html');

    app.controller('clientCtrl', ['$scope', '$modal', 'navbarService', function ($scope, $modal, navbar) {

        $scope.openEditClientModal = openEditClientModal;
        $scope.openNewDivisionModal = openNewDivisionModal;
        $scope.openNewAccountModal = openNewAccountModal;
        $scope.isLoaded = false;

        function updateClientName() {
            console.log( 'updateClientName' );
            $scope.client = navbar.all().client;
            if ($scope.client) {
                $scope.isLoaded = true;
            }
        }

        navbar.observe(updateClientName, $scope);

        var editClientModal;
        function openEditClientModal() {
            if (!editClientModal) {
                editClientModal = {
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
                        return editClientModal;
                    }
                },
                size: 'lg'
            });
        }

        var newAccountModal;
        function openNewAccountModal() {
            if (!newAccountModal) {
                newAccountModal = {
                    clientId: $scope.client.id,
                    action: 'New'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/accounts/new-edit-account.html',
                controller: 'newEditAccountCtrl',
                resolve: {
                    modalState: function() {
                        return newAccountModal;
                    }
                },
                size: 'lg'
            });
        }

        var newDivisionModal;
        function openNewDivisionModal() {
            if (!newDivisionModal) {
                newDivisionModal = {
                    clientId: $scope.client.id,
                    action: 'New'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/clients/new-edit-client.html',
                controller: 'newEditClientCtrl',
                resolve: {
                    modalState: function() {
                        return newDivisionModal;
                    }
                },
                size: 'lg'
            });
        }
    }]);
});
