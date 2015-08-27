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
            controller: ['$scope', '$window', '$location', '$state', '$rootScope', '$filter', 'creatives', 'creativeRecordService', function ($scope, $window, $location, $state, $rootScope, $filter, creatives, creativeRecordService) {

                var filter = $state.params.filter;
                var mixpoURL = getStudioUrl($window.location.hostname);

                // For testing purposes
                $scope.getStudioUrl = getStudioUrl;
                function getStudioUrl(domain) {
                    if (domain.indexOf('studio') > -1) {
                        return '//' + domain;
                    } else if (domain.indexOf('mixpo.com') > -1) {
                        return '//' + domain.replace(/(w*)\.mixpo\.com/, '$1-studio.mixpo.com');
                    } else {
                        return '//studio.mixpo.com';
                    }
                }

                $scope.openPreviewPage = function(creative) {
                    $window.open(mixpoURL + '/container?id=' + creative.id, '_blank');
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
                        console.log( 'creativeRecordService' );
                        var newCreative = ng.copy(creative);
                        console.log( 'newCreative', newCreative );
                        delete newCreative.id;
                        console.log( 'newCreative no ID', newCreative );
                        //console.log( transformCreativeData(newCreative) );


                        console.log(newCreative.all());
                        creativeRecordService.create( transformCreativeData(newCreative.all()) );
                    });

                    var transformCreativeData = function(data) {
                        console.log( 'transformCreativeData' );
                        var crudCreative =  {
                            expandedWidth: data.expandedWidth,
                            deleted: data.deleted,
                            expandedHeight: data.expandedHeight,
                            name: data.name,
                            type: data.type,
                            keywords: data.keywords.join(','),
                            embedHeight: data.embedHeight,
                            expandAnchor: data.expandAnchor,
                            device: data.device,
                            embedWidth: data.embedWidth,
                            expandDirection: data.expandDirection
                        };

                        if (data.expandMode) {
                            crudCreative.expandMode = data.expandMode;
                        }
                        console.log( 'crudCreative', crudCreative );
                        return crudCreative;
                    };
                };

                $scope.deleteCreative = function(creative) {
                    creativeRecordService.delete( creative.id );
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
                    //console.log('$scope.creatives', $scope.creatives );
                }

                creatives.observe(updateCreatives, $scope);


            }]
        };
    }]);
});
