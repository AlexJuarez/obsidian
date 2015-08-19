define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./creativeOptions.html');

    app.directive('creativeOptions', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeOptions.html',
            controller: ['$scope', function ($scope) {

                var mixpoURL = getStudioUrl($window.location.hostname);
                var filter = $state.params.filter;

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
