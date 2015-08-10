define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newEditAccountCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;

        $scope.industries = [
            {
                id: 1,
                name: 'Industry 1'
            },
            {
                id: 2,
                name: 'Industry 2'
            },
            {
                id: 3,
                name: 'Industry 3'
            },
            {
                id: 4,
                name: 'Industry 4'
            },
            {
                id: 5,
                name: 'Industry 5'
            }
        ];

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function ok(errors) {
            //console.log($scope.campaign);
            $scope.errors = errors;
            $scope.submitted = true;
            console.log('do something');
        }

    }]);
});
