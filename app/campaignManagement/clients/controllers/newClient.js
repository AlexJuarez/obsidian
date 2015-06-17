define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('newClientCtrl', ['$scope', '$modalInstance', 'channelService', function ($scope, $modalInstance, channels) {

        channels.init();

        channels.observe(updateChannels, $scope);

        $scope.ok = function (errors) {
            console.log($scope.client);
            $scope.errors = errors;
            $scope.submitted = true;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function updateChannels() {
            $scope.channels = channels.all();
        }
    }]);
});
