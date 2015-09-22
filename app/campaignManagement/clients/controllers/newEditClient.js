/* globals confirm */

define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditClientCtrl', ['$scope', '$modalInstance', 'channelService', 'modalState', 'clientRecordService', 'notification',
        function ($scope, $modalInstance, channels, modalState, clientRecords, notification) {
        $scope.action = modalState.action;

        var record;

        if (modalState.clientId) {
            record = clientRecords.get(modalState.clientId);
            record.fetch();
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
            if (ng.equals({}, errors) || !errors) {
                var onSuccess = function(resp) {
                    $modalInstance.dismiss('cancel');
                    $scope.client = {};
                    notification.success(
                        'View your client <a ui-sref="cm.campaigns.client({ clientId: id })">{{name}}</a>.',
                        {
                            locals: {
                                id: resp.data.id,
                                name: resp.data.name
                            }
                        });
                };
                if (record.hasChanges()) {
                    record.save().then(onSuccess);
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
