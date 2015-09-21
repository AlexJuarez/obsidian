/* globals confirm */

define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditClientCtrl', ['$scope', '$modalInstance', 'channelService', 'modalState', 'clientRecordService', function ($scope, $modalInstance, channels, modalState, clientRecords) {
        $scope.action = modalState.action;

        var record;

        if (modalState.clientId) {
            record = clientRecords.fetch(modalState.clientId);
        } else {
            record = clientRecords.create();
            record.set(modalState.client);
        }

        var update = function() {
            $scope.client = record.get();
            $scope.errors = record.errors();
        };

        record.observe(update, $scope);

        channels.init();
        channels.observe(updateChannels, $scope);
        function updateChannels() {
            $scope.channels = channels.all();
        }

        $scope.ok = function (errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    $modalInstance.dismiss('cancel');
                    $scope.client = {};
                };
                if (record.hasChanges()) {
                    record.save().success(onSuccess);
                }
            }
            $scope.submitted = true;
        };

        $scope.cancel = function () {
            if (record.hasChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    $modalInstance.dismiss('cancel');
                    $scope.client = {};
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.$on('$destroy', function() {
            modalState.client = $scope.client;
        });
    }]);
});
