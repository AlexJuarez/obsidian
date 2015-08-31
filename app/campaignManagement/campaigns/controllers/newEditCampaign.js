/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('newEditCampaignCtrl', [
        '$scope', '$q', '$modalInstance', 'accountService', 'accountRecordService',
        'divisionRecordService', 'clientRecordService', 'campaignRecordService', 'modalState',
        function ($scope, $q, $modalInstance, accounts, accountRecordService, divisionRecordService,
                  clientRecordService, campaignRecordService, modalState) {

        //Datepicker functions
        $scope.format = 'MM/dd/yyyy';
        $scope.openPicker = openPicker;
        $scope.datePickers = {};

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.campaign = modalState.campaign;
        $scope.action = modalState.action;

        var originalCampaign;

        if (modalState.campaignId) {
            campaignRecordService.getById(modalState.campaignId).then(function(campaign) {
                originalCampaign = campaign.all();
                originalCampaign.keywordString = originalCampaign.keywords.join(',');
                originalCampaign.objectives  = [];
                if (!$scope.campaign || $scope.campaign === {}) {
                    $scope.campaign = ng.copy(modalState.campaign || originalCampaign);
                }
                isRepInfoRequired(originalCampaign).then(function(isRequired) {
                    $scope.isRepInfoRequired = isRequired;
                });
            });
        } else {
            originalCampaign = {
                startDate: (modalState.campaign && modalState.campaign.startDate) || new Date(),
                endDate: (modalState.campaign && modalState.campaign.endDate) || new Date(),
                objectives: [],
                accountId: modalState.accountId
            };

            $scope.campaign = ng.copy(modalState.campaign || originalCampaign);
        }

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            maxMode: 'day'
        };

        accounts.observe(updateAccounts, $scope);

        function updateAccounts() {
            if (!modalState.campaignId) {
                $scope.accounts = accounts.filtered();
            }
        }

        function isRepInfoRequired(campaign) {
            var deferred = $q.defer();
            accountRecordService.getById(campaign.accountId).then(function(account) {
                divisionRecordService.getById(account.all().divisionId).then(function(division) {
                   clientRecordService.getById(division.all().clientId).then(function(client) {
                       deferred.resolve(client.all().requireRepInfo);
                   });
                });
            });

            return deferred.promise;
        }

        $scope.select = [
            {
                name: 'First Option',
                value: '1'
            },
            {
                name: 'Second Option',
                value: '2'
            },
            {
                name: 'Third Option',
                value: '3'
            },
            {
                name: 'Fourth Option',
                value: '4'
            },
            {
                name: 'Fifth Option',
                value: '5'
            }
        ];

        function openPicker($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            ng.forEach($scope.datePickers, function (value, key) {
                $scope.datePickers[key] = false;
            });

            $scope.datePickers[name] = true;
        }

        function cancel() {
            if (hasUnsavedChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    $scope.campaign = originalCampaign;
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        }

        function hasUnsavedChanges() {
            return !ng.equals($scope.campaign, originalCampaign);
        }

        function ok(errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    originalCampaign = $scope.campaign;
                    $modalInstance.dismiss('cancel');
                };
                if($scope.campaign && $scope.campaign.id) {
                    var campaignDiff = getDiff($scope.campaign, originalCampaign);

                    if (!ng.equals(campaignDiff, {})) {
                        campaignRecordService.update($scope.campaign.id, campaignDiff).then(onSuccess);
                    } else {
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    campaignRecordService.create($scope.campaign).then(onSuccess);
                }
            }
            $scope.submitted = true;
        }

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

        //Before closing the modal save the state;
        $scope.$on('$destroy', function() {
            modalState.campaign = $scope.campaign;
        });
    }]);
});
