/* globals confirm */

define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditClientCtrl', ['$scope', '$modalInstance', 'channelService', 'modalState', 'clientRecordService', 'divisionRecordService', 'notification',
        function ($scope, $modalInstance, channels, modalState, clientRecords, divisionRecords, notification) {
        $scope.action = modalState.action;

        var record;

        if (modalState.clientId) {
            record = clientRecords.get(modalState.clientId);
            clientRecords.fetch(modalState.clientId);
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
                    if (modalState.action === 'New') {
                        // Create a new division with the same name. This should be temporary
                        var divisionRecord = divisionRecords.create();
                        var division = divisionRecord.get();
                        division.name = resp.data.name;
                        division.clientId = resp.data.id;
                        divisionRecord.save().then(function(division) {
                            notification.success(
                                'View your division <a ui-sref="cm.campaigns.division({ divisionId: id })">{{name}}</a>.',
                                {
                                    locals: {
                                        id: division.data.id,
                                        name: division.data.name
                                    }
                                });
                        });
                    }

                    $modalInstance.dismiss('cancel');
                    notification.success(
                        'View your client <a ui-sref="cm.campaigns.client({ clientId: id })">{{name}}</a>.',
                        {
                            locals: {
                                id: resp.data.id,
                                name: resp.data.name
                            }
                        });
                };

                record.save().then(onSuccess);
            }
            $scope.submitted = true;
        };

        $scope.cancel = function () {
            if (record.hasChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    record.reset();
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.$on('$destroy', function() {
            modalState.client = record.changes();
        });
    }]);
});
