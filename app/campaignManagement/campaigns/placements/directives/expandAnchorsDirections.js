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
                    {id: 'up', name: 'Expand Upwards'},
                    {id: 'down', name: 'Expand Downwards'}
                ];

                $scope.expandAnchors = [
                    'bottomright',
                    'middleright',
                    'topright',
                    'bottomleft',
                    'middleleft',
                    'topleft'
                ];
            }]
        };
    }]);
});
