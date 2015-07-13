define(function (require) {
    'use strict';

    var app = require('./../../../module');
    require('tpl!./placementsByAdType.html');

    app.directive('placementsByAdType', [function () {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'campaignManagement/campaigns/placements/directives/placementsByAdType.html',
            controller: ['$scope', function ($scope) {
                $scope.big = 'whig';
            }]
        };
    }]);
});
