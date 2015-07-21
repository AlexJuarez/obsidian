define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('newCampaignCtrl', ['$scope', '$modalInstance', 'accountService', 'modalState', function ($scope, $modalInstance, accounts, modalState) {

        //Datepicker functions
        $scope.format = 'MM/dd/yyyy';
        $scope.openPicker = openPicker;
        $scope.datePickers = {};

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;

        $scope.campaign = modalState.campaign || {
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

        //Before closing the modal save the state;
        $scope.$on('$destroy', function() {
            modalState.campaign = $scope.campaign;
        });

    }]);
});
