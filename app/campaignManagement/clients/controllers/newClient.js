define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newClientCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

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

        $scope.ok = function (errors) {
            console.log(errors);
            $scope.errors = errors;
            $scope.submitted = true;
            console.log('do something');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
});
