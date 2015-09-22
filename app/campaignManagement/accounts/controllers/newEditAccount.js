/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditAccountCtrl', ['$scope', '$modalInstance', 'divisionService', 'accountRecordService', 'industryService', 'modalState', 'notification', function ($scope, $modalInstance, divisionService, accountRecords, industries, modalState, notification) {
        $scope.action = modalState.action;

        var record;

        if (modalState.accountId) {
            record = accountRecords.get(modalState.accountId);
            record.fetch();
        } else {
            record = accountRecords.create();
            record.set(modalState.account);
        }

        var update = function() {
            $scope.account = record.get();
            $scope.errors = record.errors();
        };

        record.observe(update, $scope);

        // Creating a new account under a client
        if (modalState.clientId) {
            var updateDivisions = function() {
                var divisions = divisionService.filtered()
                if (divisions.length === 1) {
                    $scope.account.divisionId = divisions[0].id;
                } else {
                    $scope.divisions = divisions;
                }
            };
            divisionService.observe(updateDivisions, $scope);
        }

        industries.init();
        industries.observe(updateIndustries, $scope);

        function updateIndustries() {
            $scope.industries = industries.all();
        }

        $scope.ok = function (errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function(resp) {
                    $modalInstance.dismiss('cancel');
                    $scope.account = {};
                    notification.success('View your account <a ui-sref="cm.campaigns.account({ accountId: id })">{{name}}</a>.',
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
                    $scope.account = {};
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        $scope.$on('$destroy', function() {
            modalState.account = $scope.account;
        });

    }]);
});
