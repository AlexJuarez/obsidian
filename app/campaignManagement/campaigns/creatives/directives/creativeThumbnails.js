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
            controller: ['$scope', '$window', '$state', '$rootScope', '$filter', 'creatives', function ($scope, $window, $state, $rootScope, $filter, creatives) {

                var mixpoURL,
                subDomainSegments = location.hostname.split('-');
                var filter = $state.params.filter;

                // Get development subdomain segments
                if (subDomainSegments.length > 1) {
                    subDomainSegments.pop();
                    subDomainSegments =  subDomainSegments.join('-');
                    mixpoURL = '//' + subDomainSegments + '-studio.mixpo.com';
                } else {
                    mixpoURL = '//studio.mixpo.com';
                }

                $scope.openPreviewPage = function(creative) {
                    $window.open(mixpoURL + '/container?id=' + creative.id, '_blank');
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

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
                    filter = toParams.filter;
                });

                function updateCreatives() {
                    var allCreatives = creatives.all();
                    var duplicateCreatives = [];

                    if (filter) {
                        duplicateCreatives = $filter('filter')(allCreatives.data, {type: filter});
                    } else {
                        duplicateCreatives = allCreatives.data;
                    }

                    $scope.creatives = duplicateCreatives;
                }

                creatives.observe(updateCreatives, $scope);

            }]
        };
    }]);
});
