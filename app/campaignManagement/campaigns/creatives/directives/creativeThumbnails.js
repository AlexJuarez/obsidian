define(function (require) {
    'use strict';

    var app = require('./../../../module');
    var ng = require('angular');

    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                limit: '='
            },
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeThumbnails.html',
            controller: ['$scope', '$window', '$modal', '$location', '$state', '$rootScope', '$filter', 'creatives', 'creativeRecordService', 'ENUMS', 'studioLocation', 'openCreativeService',
                function ($scope, $window, $modal, $location, $state, $rootScope, $filter, creatives, creativeRecordService, ENUMS, studioLocation, openCreativeService) {

                    var editCreativeModals = {};
                    var mixpoURL = studioLocation.host();

                    $scope.creativeTypes = ENUMS.up.creativeTypes;
                    $scope.filter = $scope.creativeTypes[$state.params.filter];
                    $scope.openPreviewPage = openPreviewPage;
                    $scope.openStudio = openStudio;
                    $scope.openSettings = openSettings;
                    $scope.copyCreative = copyCreative;
                    $scope.deleteCreative = deleteCreative;
                    $scope.transformCreativeData = transformCreativeData;
                    $scope.creativesAreLoaded = false;
                    $scope.showLoader = false;

                    // Show spinner if data not loaded
                    if ( !creatives.data().isLoaded() ) {
                        $scope.showLoader = true;
                    }

                    if ($scope.limit) {
                        creatives.setLimit($scope.limit);
                    }

                    creatives.observe(updateCreatives, $scope);

                    var cleanup = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
                        $scope.filter = $scope.creativeTypes[toParams.filter];
                    });

                    $scope.$on('$destroy', function() {
                        cleanup();
                    });

                    function openPreviewPage(creative) {
                        var cmd = mixpoURL + '/container';
                        var params = '?' + 'id=' + creative.id;

                        var url = cmd + params;
                        $window.open(url, '_blank');
                    }

                    function openStudio(creative) {
                        openCreativeService(creative, mixpoURL);
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
                        creativeRecordService.fetch(id).then(function(resp) {
                            var creative = ng.copy(resp.data);
                            delete creative.id;
                            creative = removeNulls(creative);
                            var record = creativeRecordService.create( transformCreativeData(creative) );
                            record.save();
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
                        
                        // Stop the loading spinner if data loaded
                        if ( creatives.data().isLoaded() ) {
                            $scope.creativesAreLoaded = true;
                        }
                    }
            }]
        };
    }]);
});
