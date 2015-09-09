define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./campaignDetails.html');

    app.directive('campaignDetails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/campaignDetails.html',
            controller: ['$scope', 'campaignDetailsService', function ($scope, details) {
                function update() {
                    $scope.details = details.all()[0];
                }

                details.observe(update, $scope);
            }]
        };
    }]);
});
