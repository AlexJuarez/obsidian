define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newClientCtrl', ['$scope', '$modalInstance', 'channelService', 'modalState', function ($scope, $modalInstance, channels, modalState) {

        $scope.client = modalState;
        console.log($scope.client);

        channels.init();

        channels.observe(updateChannels, $scope);
        $scope.ok = function (errors) {
            console.log($scope.client);
            $scope.errors = errors;
            $scope.submitted = true;
        };

        $scope.cancel = function () {
            modalState = $scope.client;
            $modalInstance.dismiss('cancel');
        };

        function updateChannels() {
            $scope.channels = channels.all();
        }
    }]);
});
