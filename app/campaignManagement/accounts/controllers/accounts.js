define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../new-account.html');

    app.controller('accountsCtrl', ['$scope', '$modal', function ($scope, $modal) {
        $scope.openModal = openModal;

        function openModal(size) {
            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/accounts/new-account.html',
                controller: 'newAccountCtrl',
                size: size
            });
        }
    }]);
});
