/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('newEditCampaignCtrl', [
        '$scope', '$q', '$modalInstance', 'accountService', 'accountRecordService',
        'divisionRecordService', 'clientRecordService', 'campaignRecordService', 'modalState', 'notification',
        function ($scope, $q, $modalInstance, accounts, accountRecords, divisionRecords,
                  clientRecords, campaignRecords, modalState, notification) {

            //Datepicker functions
            $scope.format = 'MM/dd/yyyy';
            $scope.openPicker = openPicker;
            $scope.datePickers = {};
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 0,
                maxMode: 'day'
            };

            //Modal functions
            $scope.ok = ok;
            $scope.cancel = cancel;
            $scope.action = modalState.action;

            accounts.observe(updateAccounts, $scope);

            var record;

            if (modalState.campaignId) {
                record = campaignRecords.get(modalState.campaignId);
                record.fetch().then(function(resp) {
                    isRepInfoRequired(resp.data.accountId).then(function(isRequired) {
                        $scope.isRepInfoRequired = isRequired;
                    });
                });
            } else {
                record = campaignRecords.create(modalState.originalCampaign);
                record.set(modalState.campaign);
            }

            record.observe(update, $scope);

            function update() {
                $scope.campaign = record.get();
                $scope.errors = record.errors();
            }

            function updateAccounts() {
                if (!modalState.campaignId) {
                    $scope.accounts = accounts.filtered();
                }
            }

            function isRepInfoRequired(accountId) {
                var deferred = $q.defer();
                accountRecords.fetch(accountId).then(function(resp) {
                    divisionRecords.fetch(resp.data.divisionId).then(function(resp) {
                        clientRecords.getById(resp.data.clientId).then(function(resp) {
                           deferred.resolve(resp.data.requireRepInfo);
                       });
                    });
                });
                return deferred.promise;
            }

            function openPicker($event, name) {
                $event.preventDefault();
                $event.stopPropagation();

                ng.forEach($scope.datePickers, function (value, key) {
                    $scope.datePickers[key] = false;
                });

                $scope.datePickers[name] = true;
            }

            function cancel() {
                if (record.hasChanges()) {
                    if (confirm('You have unsaved changes. Really close?')) {
                        $modalInstance.dismiss('cancel');
                        record.reset();
                        $scope.campaign = record.get();
                    }
                } else {
                    $modalInstance.dismiss('cancel');
                }
            }

            function ok(errors) {
                $scope.errors = errors;
                if (ng.equals({}, $scope.errors) || !$scope.errors) {
                    var onSuccess = function(resp) {
                        $modalInstance.dismiss('cancel');
                        $scope.campaign = {};
                        notification.success('View your campaign <a ui-sref="cm.campaigns.detail({ campaignId: id })">{{name}}</a>.',
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
            }

            //Before closing the modal save the state;
            $scope.$on('$destroy', function() {
                modalState.campaign = $scope.campaign;
            });
    }]);
});
