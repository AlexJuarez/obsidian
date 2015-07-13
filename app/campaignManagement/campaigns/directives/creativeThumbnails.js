define(function (require) {
    'use strict';

    var app = require('./../../module');
    
    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/directives/creativeThumbnails.html',
            controller: ['$scope', 'campaignCreatives', function ($scope, creativeThumbnails) {
                
                function updateCreatives() {
                    $scope.creatives = creativeThumbnails.all();
                }

                creativeThumbnails.observe(updateCreatives, $scope);
            }]
        };
    }]);
});
