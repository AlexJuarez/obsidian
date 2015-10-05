'use strict';

define(function (require) {
    var app = require('./../../module');
    require('tpl!./../new-edit-client.html');

    app.controller('clientsCtrl', ['$scope', 'topClientsService', '$modal', function ($scope, topClients, $modal) {

        $scope.openNewClientModal = openNewClientModal;
        //$scope.isLoaded = false;
        //console.log( '$scope.isLoaded',$scope.isLoaded );

        topClients.init();

        topClients.observe(updateTopClients, $scope, true);


        function updateTopClients() {
            $scope.topClients = topClients.all();
            //console.log( 'updateTopClients',$scope.topClients.data );
            // if ($scope.topClients.data) {
            //     $scope.isLoaded = true;
            // }
            // console.log( '$scope.isLoaded',$scope.isLoaded );
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
