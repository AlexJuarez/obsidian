define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('modalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

        $scope.ok = function () {
            console.log('do something');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
});
