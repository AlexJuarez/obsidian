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
            controller: ['$scope', '$window', '$modal', '$location', '$state', '$rootScope', '$filter', 'creatives', 'creativeRecordService', 'studioLocation',
                function ($scope, $window, $modal, $location, $state, $rootScope, $filter, creatives, creativeRecordService, studioLocation) {

                    var editCreativeModals = {};
                    var mixpoURL = studioLocation.host();

                    $scope.filter = $state.params.filter;
                    $scope.openPreviewPage = openPreviewPage;
                    $scope.openStudio = openStudio;
                    $scope.openSettings = openSettings;
                    $scope.gotoPlacements = gotoPlacements;
                    $scope.copyCreative = copyCreative;
                    $scope.deleteCreative = deleteCreative;
                    $scope.transformCreativeData = transformCreativeData;

                    creatives.observe(updateCreatives, $scope);

                    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
                        $scope.filter = toParams.filter;
                    });

                    function openPreviewPage(creative) {
                        $window.open(mixpoURL + '/container?id=' + creative.id, '_blank');
                    }

                    function openStudio(id) {
                        $window.open(mixpoURL + '/studio?sdf=open&guid=' + id, '_blank');
                    }

                    var removeNulls = function(creative) {
                        var newCreative = {};
                        for (var prop in creative) {
                            if (creative.hasOwnProperty(prop) && (creative[prop] !== null && typeof creative[prop] !== 'undefined')) {
                                newCreative[prop] = creative[prop];
                            }
                        }
                        return newCreative;
                    };

                    function openSettings(id) {
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
                    }

                    function gotoPlacements(creative) {
                        $state.go('cm.campaigns.detail.placements', { campaignId: creative.campaignId });
                    }

                    function transformCreativeData(data) {
                        var crudCreative =  {
                            campaignId: data.campaignId,
                            expandedWidth: data.expandedWidth,
                            deleted: data.deleted,
                            expandedHeight: data.expandedHeight,
                            name: data.name + ' (copy)',
                            type: data.type,
                            keywords: data.keywords.join(','),
                            embedHeight: data.embedHeight,
                            device: data.device,
                            embedWidth: data.embedWidth,
                            clickthroughUrl: data.clickthroughUrl
                        };

                        if (data.expandAnchor) {
                            crudCreative.expandAnchor = data.expandAnchor;
                        } else {
                            crudCreative.expandAnchor = 'topright';
                        }

                        if (data.expandDirection) {
                            crudCreative.expandDirection = data.expandDirection;
                        } else {
                            crudCreative.expandDirection = 'left';
                        }

                        if (data.expandMode) {
                            crudCreative.expandMode = data.expandMode;
                        }
                        return crudCreative;
                    }

                    function copyCreative(id) {
                        creativeRecordService.getById(id).then(function(creative) {
                            creative = creative.all();
                            var newCreative = ng.copy(creative);
                            delete newCreative.id;
                            newCreative = removeNulls(newCreative);
                            creativeRecordService.create( transformCreativeData(newCreative) );
                        });
                    }

                    function deleteCreative(creative) {
                        creativeRecordService.delete( creative.id );
                    }

                    function updateCreatives() {
                        var allCreatives = creatives.all();
                        var duplicateCreatives = [];

                        if ($scope.filter) {
                            duplicateCreatives = $filter('filter')(allCreatives.data, {type: $scope.filter});
                        } else {
                            duplicateCreatives = allCreatives.data;
                        }

                        $scope.creatives = duplicateCreatives;
                    }

            }]
        };
    }]);
});
