define(function (require) {
    'use strict';

    var app = require('./../../../module');
    
    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeThumbnails.html',
            controller: ['$scope', 'campaignCreative', function ($scope, campaignCreative) {
                
                function updateCreatives() {
                    $scope.creatives = campaignCreative.all();
                }

                campaignCreative.observe(updateCreatives, $scope);
                
            }]
        };
    }]);
});
