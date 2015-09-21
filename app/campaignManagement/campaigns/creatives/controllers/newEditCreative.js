/* globals confirm */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'enumService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX',
            function ($scope, $modalInstance, newCreativeService, enums, creatives, campaigns,
                      creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX) {

        //Modal functions
        $scope.ok = undefined;
        $scope.cancel = undefined;
        $scope.creative = modalState.creative;
        $scope.action = modalState.action;
        $scope.swfAllowedExtensions = ['swf'];
        $scope.URL_REGEX = URL_REGEX;
        $scope.MONEY_REGEX = MONEY_REGEX;

        var types = [
            { id: 'IBV', name: 'In-Banner Video' },
            { id: 'ISV', name: 'In-Stream Video' },
            { id: 'RM', name: 'Rich Media' },
            { id: 'SWF', name: 'SWF' },
            { id: 'IMG', name: 'Image' }
        ];

        var typeSettings = {
            IBV: {
                environments: [0,1,2,3],
                dimensions: [0,1,2,3,10,11,12,13],
                expandedDimensions: [0,1,2,3,4,5,6,7,8]
            },
            ISV: {
                environments: [0,1],
                dimensions: [5,6,7,8,9,13],
                expandedDimensions: undefined
            },
            RM: {
                environments: [0,1,2,3],
                dimensions: [0,1,2,3,10,11,12,13],
                expandedDimensions: [0,1,2,3,4,5,6,7,8]
            },
            SWF: {
                environments: [1],
                dimensions: undefined,
                expandedDimensions: undefined
            },
            IMG: {
                environments: [0,1,2,3],
                dimensions: undefined,
                expandedDimensions: undefined
            }
        };

        var environments = [
            { id: 'multi-screen', name: 'Multi-Screen (Desktop, Tablet and Phone)' },
            { id: 'desktop', name: 'Desktop' },
            { id: 'mobile', name: 'Tablet & Phone' },
            { id: 'mraid', name: 'Tablet & Phone (In-App/MRAID)' }
        ];

        var dimensions = [
            { widthHeight: [160, 600], name: '160x600' },
            { widthHeight: [180, 150], name: '180x150' },
            { widthHeight: [300, 250], name: '300x250' },
            { widthHeight: [300, 600], name: '300x600' },
            { widthHeight: [728, 90], name: '728x90' },
            { widthHeight: [480, 360], name: '480x360 (4:3)' },
            { widthHeight: [533, 300], name: '533x300 (16:9)' },
            { widthHeight: [640, 360], name: '640x360 (16:9)' },
            { widthHeight: [640, 480], name: '640x480 (4:3)' },
            { widthHeight: [768, 432], name: '768x432 (16:9)' },
            { widthHeight: [728, 90], name: '728x90' },
            { widthHeight: [970, 90], name: '970x90' },
            { widthHeight: [1, 1], name: 'Interstitial 1x1' },
            { name: 'Custom' }
        ];

        var expandedDimensions = [
            { name: 'Non-Expanding' },
            { widthHeight: [300, 600], name: '300x600' },
            { widthHeight: [560, 300], name: '560x300' },
            { widthHeight: [600, 250], name: '600x250' },
            { widthHeight: [600, 600], name: '600x600' },
            { widthHeight: [728, 315], name: '728x315' },
            { widthHeight: [970, 250], name: '970x250' },
            { widthHeight: [970, 415], name: '970x415' },
            { name: 'Custom' }
        ];

        setupTranslationLogic();
        setupModalLogic();

        function setupTranslationLogic() {
            // Update available environments, dimensions and expanded dimensions
            // based on creative types and the settings above
            $scope.types = types;
            $scope.$watch('creative.type', updateType);

            function updateType() {
                if ($scope.creative && typeSettings[$scope.creative.type]) {
                    var settings = typeSettings[$scope.creative.type];
                    updateEnvironments(settings.environments);
                    updateDimensions(settings.dimensions);
                    updateExpandedDimensions(settings.expandedDimensions);
                }
            }

            function updateEnvironments(enabledEnvironmentIds) {
                $scope.environments = filterById(environments, enabledEnvironmentIds);
            }

            function updateDimensions(enabledDimensionIds) {
                $scope.dimensions = filterById(dimensions, enabledDimensionIds);
            }

            function updateExpandedDimensions(enabledExpandedDimensionIds) {
                $scope.expandedDimensions = filterById(expandedDimensions, enabledExpandedDimensionIds);
            }

            function filterById(options, idArray) {
                if (typeof idArray === 'undefined') {
                    return undefined;
                } else {
                    var filtered = [];
                    var currentId;
                    var current;
                    for(var i = 0; i < idArray.length; i ++) {
                        currentId = idArray[i];
                        current = options[currentId];
                        filtered.push({
                            id: currentId,
                            name: current.name
                        });
                    }

                    return filtered;
                }
            }

            $scope.$watch('creative.dimensions', function() {
                if ($scope.creative && $scope.creative.dimensions) {
                    $scope.dimensionsAreCustom =
                        dimensions[$scope.creative.dimensions].name === 'Custom';
                }
            });

            $scope.$watch('creative.expandedDimensions', function() {
                if ($scope.creative && $scope.creative.expandedDimensions) {
                    $scope.expandedDimensionsAreCustom =
                        expandedDimensions[$scope.creative.expandedDimensions].name === 'Custom';
                }
            });
        }

        function setupModalLogic() {
            var originalCreative;

            if(modalState.creativeId) {
                creativeRecordService.getById(modalState.creativeId).then(function(creative) {
                    originalCreative = creative.all();
                    if(! $scope.creative || $scope.creative === {}) {
                        $scope.creative = transformCreativeToModal(ng.copy(modalState.creative || originalCreative));
                    }
                });
            } else {
                originalCreative = {
                    startDate: (modalState.creative && modalState.creative.startDate) || new Date(),
                    endDate: (modalState.creative && modalState.creative.endDate) || new Date(),
                    objectives: [],
                    campaignId: modalState.campaignId
                };

                $scope.creative = transformCreativeToModal(ng.copy(modalState.creative || originalCreative));
            }

            campaigns.observe(updateCampaigns, $scope);

            function updateCampaigns() {
                if(! modalState.creativeId) {

                    // TODO: add render limit so this isn't crazy slow
                    //$scope.campaigns = campaigns.all().slice(0, 10);
                    $scope.campaigns = [{id: '1c5cf047-5ecd-444b-822a-17e1eebed4b3', name: 'test'}];
                }
            }

            $scope.cancel = function() {
                if(hasUnsavedChanges()) {
                    if(confirm('You have unsaved changes. Really close?')) {
                        $scope.creative = originalCreative;
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    $modalInstance.dismiss('cancel');
                }
            };

            function hasUnsavedChanges() {
                return ! ng.equals($scope.creative, originalCreative);
            }

            $scope.ok = function(errors) {
                console.log($scope);
                $scope.errors = errors;
                if(ng.equals({}, $scope.errors) || ! $scope.errors) {
                    var transformedCreative = transformModalToCreative();
                    var onSuccess = function() {
                        originalCreative = $scope.creative;
                        $modalInstance.dismiss('cancel');
                    };
                    if($scope.creative && $scope.creative.id) {
                        var creativeDiff = getDiff($scope.creative, originalCreative);

                        if(! ng.equals(creativeDiff, {})) {
                            creativeRecordService.update($scope.creative.id, creativeDiff).then(onSuccess);
                        } else {
                            $modalInstance.dismiss('cancel');
                        }
                    } else {
                        newCreativeService(transformedCreative)
                            .then(function(url) {
                                onSuccess();
                                $window.open(url, '_blank');
                            });
                    }
                }
                $scope.submitted = true;
            };

            function transformModalToCreative() {
                var creative = $scope.creative;
                var allDimensions = getDimensions(creative);
                var getEnvironment = function(id) {
                    for (var i=0; i<$scope.environments.length; i++) {
                        if ($scope.environments[i].id === id) {
                            return environments[id].id;
                        }
                    }
                    return null;
                };

                return {
                    expandedWidth: allDimensions.expanded && parseInt(allDimensions.expanded.width, 10),
                    expandedHeight: allDimensions.expanded && parseInt(allDimensions.expanded.height, 10),
                    embedWidth: parseInt(allDimensions.embed.width, 10),
                    embedHeight: parseInt(allDimensions.embed.height, 10),
                    clickthroughUrl: creative.clickthroughUrl,
                    type: creative.type,
                    environment: getEnvironment(creative.environment),
                    name: creative.name
                };
            }

            function transformCreativeToModal(creative) {
                //debugger;
                return creative;
            }

            function getDimensions(creative) {
                var allDimensions = {
                    embed: {},
                    expanded: {}
                };

                var widthHeight = dimensions[creative.dimensions].widthHeight;
                allDimensions.embed.width = widthHeight && widthHeight[0];
                allDimensions.embed.height = widthHeight && widthHeight[1];

                allDimensions.embed = {
                    width: allDimensions.embed.width || creative.customDimensionsWidth,
                    height: allDimensions.embed.height || creative.customDimensionsHeight
                };

                if (creative.expandedDimensions) {
                    widthHeight = expandedDimensions[creative.expandedDimensions].widthHeight;
                    allDimensions.expanded.width = widthHeight && widthHeight[0];
                    allDimensions.expanded.height = widthHeight && widthHeight[1];

                    allDimensions.expanded = {
                        width: allDimensions.expanded.width || creative.customExpandedDimensionsWidth,
                        height: allDimensions.expanded.height || creative.customExpandedDimensionsHeight
                    };
                }

                return allDimensions;
            }

            // Simple diffing function for PUT request
            function getDiff(changed, original) {
                var diff = {};
                for(var index in changed) {
                    if(changed.hasOwnProperty(index)) {
                        if(original[index] && ! ng.equals(changed[index], original[index])) {
                            diff[index] = changed[index];
                        }
                    }
                }

                return diff;
            }

            //Before closing the modal save the state;
            $scope.$on('$destroy', function() {
                modalState.creative = $scope.creative;
            });
        }
    }]);
});
