define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./expandAnchorsDirections.html');

    app.directive('expandAnchorsDirections', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                expandAnchor: '=',
                expandDirection: '='
            },
            templateUrl: 'campaignManagement/campaigns/placements/directives/expandAnchorsDirections.html',
            controller: ['$scope', function ($scope) {
                $scope.expandDirections = [
                    {id: 'left', name: 'Expand to Left'},
                    {id: 'right', name: 'Expand to Right'},
                    {id: 'top', name: 'Expand Upwards'},
                    {id: 'bottom', name: 'Expand Downwards'}
                ];

                var commonAnchors = [
                    'bottomright',
                    'topright',
                    'bottomleft',
                    'topleft'
                ];

                var expandAnchorPossibilities = {
                    left: ['left', 'right'].concat(commonAnchors),
                    right: ['left', 'right'].concat(commonAnchors),
                    top: ['top', 'bottom'].concat(commonAnchors),
                    bottom: ['top', 'bottom'].concat(commonAnchors)
                };

                $scope.$watch('expandDirection', function() {
                   $scope.expandAnchors = expandAnchorPossibilities[$scope.expandDirection];
                });
            }]
        };
    }]);
});
