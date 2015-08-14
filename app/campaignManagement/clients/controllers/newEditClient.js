/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditClientCtrl', ['$scope', '$modalInstance', 'channelService', 'modalState', 'clientRecordService', function ($scope, $modalInstance, channels, modalState, clientRecordService) {
        $scope.client = modalState.client;
        $scope.action = modalState.action;

        var originalClient;

        if (modalState.clientId) {
            clientRecordService.getById(modalState.clientId).then(function(client) {
                originalClient = client.all();
                if (!$scope.client) {
                    $scope.client = ng.copy(originalClient);
                }
            });
        }

        channels.init();
        channels.observe(updateChannels, $scope);
        function updateChannels() {
            $scope.channels = channels.all();
        }

        $scope.ok = function (errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    originalClient = $scope.client;
                    $modalInstance.dismiss('cancel');
                };
                if($scope.client && $scope.client.id) {
                    var clientDiff = getDiff($scope.client, originalClient);

                    if (!ng.equals(clientDiff, {})) {
                        clientRecordService.update($scope.client.id, clientDiff).then(onSuccess);
                    } else {
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    clientRecordService.create($scope.client).then(onSuccess);
                }
            }
            $scope.submitted = true;
        };


        // Simple diffing function for PUT request
        function getDiff(changed, original) {
            var diff = {};
            for (var index in changed) {
                if (changed.hasOwnProperty(index)) {
                    if (original[index] && !ng.equals(changed[index], original[index])) {
                        diff[index] = changed[index];
                    }
                }
            }

            return diff;
        }

        $scope.cancel = function () {
            if (hasUnsavedChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    $scope.client = ng.copy(originalClient);
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        function hasUnsavedChanges() {
            return !ng.equals(originalClient, $scope.client);
        }

        $scope.$on('$destroy', function() {
            modalState.client = $scope.client;
        });
    }]);
});
