/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');

    var ng = require('angular');

    app.controller('newEditAccountCtrl', ['$scope', '$modalInstance', 'clientDivisionsService', 'accountRecordService', 'industryService', 'modalState', function ($scope, $modalInstance, clientDivisionsService, accountRecordService, industries, modalState) {
        $scope.account = modalState.account;
        $scope.action = modalState.action;

        var originalAccount;

        // Editing an account
        if (modalState.accountId) {
            accountRecordService.getById(modalState.accountId).then(function(account) {
                originalAccount = account.all();
                if (!$scope.account || $scope.account === {}) {
                    $scope.account = ng.copy(originalAccount);
                }
            });
        }

        // Creating a new account under a division
        if (modalState.divisionId) {
            if (!$scope.account) {
                $scope.account = {};
            }
            if (!originalAccount) {
                originalAccount = {};
            }
            $scope.account.divisionId = originalAccount.divisionId = modalState.divisionId;
        }

        // Creating a new account under a client
        if (modalState.clientId) {
            clientDivisionsService.get(modalState.clientId).then(function(divisions) {
                $scope.divisions = divisions;
            });
        }

        industries.init();
        industries.observe(updateIndustries, $scope);
        function updateIndustries() {
            $scope.industries = industries.all();
        }

        $scope.ok = function (errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    originalAccount = $scope.account;
                    $modalInstance.dismiss('cancel');
                };
                if($scope.account && $scope.account.id) {
                    var accountDiff = getDiff($scope.account, originalAccount);

                    if (!ng.equals(accountDiff, {})) {
                        accountRecordService.update($scope.account.id, accountDiff).then(onSuccess);
                    } else {
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    accountRecordService.create($scope.account).then(onSuccess);
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
                    $scope.account = ng.copy(originalAccount);
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        function hasUnsavedChanges() {
            return !ng.equals(originalAccount, $scope.account);
        }

        $scope.$on('$destroy', function() {
            modalState.account = $scope.account;
        });

    }]);
});
