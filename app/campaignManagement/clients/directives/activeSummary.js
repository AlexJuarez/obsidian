define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./activeSummary.html');

    app.directive('activeSummary', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/clients/directives/activeSummary.html',
            controller: ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
                $http.get('/api/v3/clientSet?dimensions&metrics=countActive,countAccountsActive,countCampaignsActive,countCampaignsPreFlight,countCampaignsInFlight').then(function (res) {
                    $timeout(function () {
                        $scope.active = res.data.clientSet[0].metrics;
                        $scope.$apply();
                    });
                });
            }]
        };
    }]);
});
