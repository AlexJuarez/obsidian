define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./accountSummary.html');

    app.directive('accountSummary', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/accounts/directives/accountSummary.html',
            controller: ['$scope', 'campaignsHeader', function ($scope, campaignsHeader) {
                function updateSummary() {
                    $scope.summary = campaignsHeader.all();
                }

                campaignsHeader.observe(updateSummary, $scope, true);
            }]
        };
    }]);
});
