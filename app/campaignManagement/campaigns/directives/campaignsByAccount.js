define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaignsByAccount.html');

    app.directive('campaignsByAccount', [function () {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/campaignsByAccount.html',
            controller: ['$scope', 'campaignsByAccount', function ($scope, campaignsByAccount) {
                function updateByAccount() {
                    $scope.byAccount = campaignsByAccount.all();
                }

                campaignsByAccount.observe(updateByAccount, $scope);
            }]
        };
    }]);
});
