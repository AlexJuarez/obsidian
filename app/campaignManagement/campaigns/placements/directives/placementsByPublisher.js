define(function (require) {
    'use strict';

    var app = require('./../../../module');
    require('tpl!./placementsByPublisher.html');

    app.directive('placementsByPublisher', [function () {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'campaignManagement/campaigns/placements/directives/placementsByPublisher.html',
            controller: ['$scope', function ($scope) {
                $scope.big = 'whig';
            }]
        };
    }]);
});
