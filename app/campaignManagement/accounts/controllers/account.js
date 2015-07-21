define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../new-account.html');

    app.controller('accountCtrl', ['$scope', 'navbarService', 'campaignModal', function ($scope, navbar, campaignModal) {
        function updateAccountInfo() {
            $scope.account = navbar.all().account;
        }

        navbar.observe(updateAccountInfo, $scope);

        $scope.campaignModal = campaignModal.create;
    }]);
});
