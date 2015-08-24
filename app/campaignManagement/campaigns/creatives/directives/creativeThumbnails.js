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
            controller: ['$scope', '$window', '$modal', '$state', '$rootScope', '$filter', 'creatives', function ($scope, $window, $modal, $state, $rootScope, $filter, creatives) {

                var mixpoURL = getStudioUrl($window.location.hostname);
                var filter = $state.params.filter;
                var editCreativeModals = {};

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
                    if (!editCreativeModals[id]) {
                        editCreativeModals[id] = {
                            creativeId: id,
                            action: 'Edit'
                        };
                    }

                    $modal.open({
                        animation: 'true',
                        templateUrl: 'campaignManagement/campaigns/creatives/new-edit-creative.html',
                        controller: 'newEditCreativeCtrl',
                        resolve: {
                            modalState: function() {
                                return editCreativeModals[id];
                            }
                        },
                        size: 'lg'
                    });
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
