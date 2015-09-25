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
                var imageDirectory = '/images/anchorsExpandDirections/';
                $scope.expandAnchors = [];
                $scope.expandDirections = [
                    {id: 'left', name: 'Expand to Left'},
                    {id: 'right', name: 'Expand to Right'},
                    {id: 'up', name: 'Expand Upwards'},
                    {id: 'down', name: 'Expand Downwards'}
                ];
                $scope.expandDirection = 'left';

                var commonAnchors = [
                    'bottomright',
                    'topright',
                    'bottomleft',
                    'topleft'
                ];

                var expandAnchorPossibilities = {
                    left: ['left', 'right'].concat(commonAnchors),
                    right: ['left', 'right'].concat(commonAnchors),
                    up: ['top', 'bottom'].concat(commonAnchors),
                    down: ['top', 'bottom'].concat(commonAnchors)
                };

                $scope.$watch('expandDirection', function() {
                    if (typeof $scope.expandDirection === 'string') {
                        $scope.expandAnchors = [];
                        var expandAnchors = expandAnchorPossibilities[$scope.expandDirection];
                        expandAnchors.forEach(function(anchor) {
                            $scope.expandAnchors.push({
                                image: imageDirectory + $scope.expandDirection + '_' + anchor + '.svg',
                                value: anchor
                            });
                        });
                    }
                });

                $scope.setExpandAnchor = function(anchor) {
                    $scope.expandAnchor = anchor;
                }
            }]
        };
    }]);
});
