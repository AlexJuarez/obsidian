define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newAccountCtrl', ['$scope', '$modalInstance', 'accountService', function ($scope, $modalInstance, accounts) {

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;

        accounts.observe(updateAccounts, $scope);

        function updateAccounts() {
            $scope.accounts = accounts.filtered();
        }

        $scope.select = [
            {
                name: 'First Choice',
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
