define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('editCampaignCtrl', ['$scope', '$modalInstance', 'accountService', 'modalState', 'DATE_FORMAT', function ($scope, $modalInstance, accounts, modalState, DATE_FORMAT) {

        //Datepicker functions
        $scope.format = DATE_FORMAT;
        $scope.openPicker = openPicker;
        $scope.datePickers = {};
        $scope.edit = true;

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;

        $scope.campaign = {
            campaignName: modalState.name,
            startDate: new Date(),
            endDate: new Date(),
            objectives: []
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            maxMode: 'day'
        };

        accounts.observe(updateAccounts, $scope);

        function updateAccounts() {
            $scope.accounts = accounts.filtered();
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
            $modalInstance.dismiss('cancel');
        }

        function ok(errors) {
            console.log($scope.campaign);
            $scope.errors = errors;
            $scope.submitted = true;
            console.log('do something');
        }

    }]);
});
