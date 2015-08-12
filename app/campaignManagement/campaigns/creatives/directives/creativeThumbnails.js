define(function (require) {
    'use strict';

    var app = require('./../../../module');
    var ng = require('angular');

    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeThumbnails.html',
            controller: ['$scope', '$window', '$state', '$rootScope', '$filter', 'creatives', 'creativeRecordService', function ($scope, $window, $state, $rootScope, $filter, creatives, creativeRecordService) {



                var mixpoURL,
                subDomainSegments = location.hostname.split('-');
                var filter = $state.params.filter;

                // Get development subdomain segments
                if (subDomainSegments.length > 1) {
                    subDomainSegments.pop();
                    subDomainSegments.join('-');
                    mixpoURL = '//' + subDomainSegments + '-studio.mixpo.com';
                } else {
                    mixpoURL = '//studio.mixpo.com';
                }

                $scope.openPreviewPage = function(id, name) {
                    console.log( 'thumbnail directive: preview creative ' + id, name );
                    $window.open(mixpoURL + '/videoad/' + id + '/' + name, '_blank');
                };

                $scope.openStudio = function(id) {
                    $window.open(mixpoURL + '/studio?sdf=open&guid=' + id, '_blank');
                };

                $scope.openSettings = function(id) {
                    console.log( 'thumbnail directive: open settings ' + id );
                };

                $scope.openPlacements = function(id) {
                    console.log( 'thumbnail directive: open placements ' + id );
                };

                $scope.copyCreative = function(id) {
                    console.log( 'Copy Creative ' + id );
                    
                    creativeRecordService.getById(id).then(function(creative) {
                        var newCreative = ng.copy(creative);
                        delete newCreative.id;
                        creativeRecordService.create(newCreative);
                    });
                };

                $scope.deleteCreative = function(id) {
                    console.log( 'thumbnail directive: delete creative ' + id );
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

                    //console.log('allCreatives', allCreatives );
                    //console.log('duplicateCreatives', duplicateCreatives );
                }

                creatives.observe(updateCreatives, $scope);

                creativeRecordService.observe(function(newUpdatedRecord) {
                    console.log( 'newUpdatedRecord', newUpdatedRecord );
                    creatives.addData([newUpdatedRecord]);

                }, $scope, true);

            }]
        };
    }]);
});
