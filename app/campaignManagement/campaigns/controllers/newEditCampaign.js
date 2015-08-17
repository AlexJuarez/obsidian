/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('newEditCampaignCtrl', ['$scope', '$modalInstance', 'accountService', 'campaignRecordService', 'modalState', function ($scope, $modalInstance, accounts, campaignRecordService, modalState) {

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

        $scope.select = [
            {
                name: 'Uno 1',
                value: '1'
            },
            {
                name: 'Second',
                value: '2'
            },
            {
                name: 'Choice #3',
                value: '3'
            },
            {
                name: 'Pick me, pick me, pick me!',
                value: '4'
            },
            {
                name: 'Sheeple',
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
            $scope.submitted = true;
            //TODO: do something
        }

        //Before closing the modal save the state;
        $scope.$on('$destroy', function() {
            modalState.campaign = $scope.campaign;
        });
    }]);
});
