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

                $scope.openPreviewPage = function(id, name) {
                    var n = name.split(' ').join('-');
                    var previewUrl = '//'+ urlPrefix() + '/videoad/' + id + '/' + n;
                    $window.open(previewUrl, '_blank');
                };

                $scope.openStudio = function(id) {
                    var studioUrl = '//'+ urlPrefix() + '/studio?sdf=open&guid=' + id;
                    $window.open(studioUrl, '_blank');
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

                        creativeRecordService.create( transformCreativeData(newCreative) );
                    });
                };
                creativeRecordService.observe(function(newUpdatedRecord) {
                    console.log( 'newUpdatedRecord', newUpdatedRecord );
                    creatives.addData([newUpdatedRecord]);

                }, $scope, true);
                
                var transformCreativeData = function(obj) {
                    console.log( 'transformCreativeData' );
                    var allData = obj.all();
                    var newData = {};
                    newData.expandedWidth = allData.expandedWidth;
                    newData.deleted = allData.deleted;
                    newData.expandedHeight = allData.expandedHeight;
                    newData.name = allData.name;
                    newData.type = allData.type;
                    newData.keywords = allData.keywords;
                    newData.embedHeight = allData.embedHeight;
                    newData.expandAnchor = allData.expandAnchor;
                    newData.expandMode = allData.expandMode;
                    newData.device = allData.device;
                    newData.embedWidth = allData.embedWidth;
                    newData.expandDirection = allData.expandDirection;
                    console.log( newData );
                    return newData;

                    //return $filter('filter')(obj.all(transformedData), {type: filter});
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
                    //console.log('$scope.creatives', $scope.creatives );
                }

                creatives.observe(updateCreatives, $scope);


            }]
        };
    }]);
});
