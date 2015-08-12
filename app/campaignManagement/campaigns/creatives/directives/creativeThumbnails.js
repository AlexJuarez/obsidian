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

                var urlPrefix = function() {
                    if ($location.$$host === 'localhost') {
                        return 'thorwhal-dev-studio.mixpo.com';
                    } else {
                        return $location.$$host;
                    }
                };


                //console.log( creatives );
                // $scope.creatives = {
                //     numPlacements: 0
                // }

                $scope.openPreviewPage = function(id, name) {
                    console.log( 'thumbnail directive: preview creative ' + id, name );
                    var n = name.split(' ').join('-');
                    var previewUrl = '//'+ urlPrefix() + '/videoad/' + id + '/' + n;
                    $window.open(previewUrl, '_blank');
                    //$window.open(mixpoURL + '/videoad/' + id + '/' + name, '_blank');
                };

                $scope.openStudio = function(id) {
                    var studioUrl = '//'+ urlPrefix() + '/studio?sdf=open&guid=' + id;
                    $window.open(studioUrl, '_blank');

                    //$window.open(mixpoURL + '/studio?sdf=open&guid=' + id, '_blank');
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
                    console.log('$scope.creatives', $scope.creatives );
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
