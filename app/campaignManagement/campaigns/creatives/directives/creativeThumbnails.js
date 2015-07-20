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
            controller: ['$scope', '$window', 'campaignCreative', function ($scope, $window, campaignCreative) {

                // Should this be a shared filter for other parts of the app to use? -JFlo
                var mixpoURL,
                subDomainSegments = location.hostname.split('-');
                
                // Get development subdomain segments
                if (subDomainSegments.length > 1) {
                    subDomainSegments.pop();
                    subDomainSegments.join('-');
                    mixpoURL = '//' + subDomainSegments + '-studio.mixpo.com';
                } else {
                    mixpoURL = '//studio.mixpo.com';
                }
                
                $scope.openPreviewPage = function(id, name) {
                    console.log( 'thumbnail controller: preview creative ' + id, name );
                    $window.open(mixpoURL + '/videoad/' + id + '/' + name, '_blank');
                };

                $scope.openStudio = function(id) {
                    $window.open(mixpoURL + '/studio?sdf=open&guid=' + id, '_blank');
                };

                $scope.openSettings = function(id) {
                    console.log( 'thumbnail controller: open settings ' + id );
                };

                $scope.openPlacements = function(id) {
                    console.log( 'thumbnail controller: open placements ' + id );
                };

                $scope.copyCreative = function(id) {
                    console.log( 'open Copy Creative modal ' + id );
                };

                $scope.deleteCreative = function(id) {
                    console.log( 'thumbnail controller: delete creative ' + id );
                };



                function updateCreatives() {
                    $scope.creatives = campaignCreative.all();
                }

                campaignCreative.observe(updateCreatives, $scope);

            }]
        };
    }]);
});
