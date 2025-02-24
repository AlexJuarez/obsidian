/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditAccountCtrl', ['$scope', '$modalInstance', 'divisionService', 'accountRecordService', 'industryService', 'modalState', 'notification', 'URL_REGEX',
        function ($scope, $modalInstance, divisionService, accountRecords, industries, modalState, notification, URL_REGEX) {
        $scope.action = modalState.action;
        $scope.URL_REGEX = URL_REGEX;

        var record;

        if (modalState.accountId) {
            record = accountRecords.get(modalState.accountId);
            accountRecords.fetch(modalState.accountId);
        } else {
            record = accountRecords.create(modalState.originalAccount);
            record.set(modalState.account);
        }

        var update = function() {
            $scope.account = record.get();
            $scope.errors = record.errors();
        };

        record.observe(update, $scope);

        // Creating a new account under a client
        if (modalState.clientId || modalState.divisionId) {
            var updateDivisions = function() {
                var divisions = divisionService.filtered();
                if (divisions.length === 1) {
                    record._set({divisionId: divisions[0].id});
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
            if (ng.equals({}, errors) || !errors) {
                var onSuccess = function(resp) {
                    $modalInstance.dismiss('cancel');
                    notification.success('View your account <a ui-sref="cm.campaigns.account({ accountId: id })">{{name}}</a>.',
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
            modalState.account = record.changes();
        });

    }]);
});
