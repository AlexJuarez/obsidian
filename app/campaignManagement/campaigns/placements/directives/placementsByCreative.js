define(function (require) {
    'use strict';

    var app = require('./../../../module');
    require('tpl!./placementsByCreative.html');

    app.directive('placementsByCreative', [function () {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'campaignManagement/campaigns/placements/directives/placementsByCreative.html',
            controller: ['$scope', function ($scope) {
                $scope.big = 'whig';
            }]
        };
    }]);
});
