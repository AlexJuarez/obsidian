/* globals confirm */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'enumService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX', 'notification',
    function ($scope, $modalInstance, newCreativeService, enums, creatives, campaigns,
                      creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX, notification) {

        //Modal functions
        $scope.ok = undefined;
        $scope.cancel = undefined;
        $scope.action = modalState.action;
        $scope.swfAllowedExtensions = ['swf'];
        $scope.URL_REGEX = URL_REGEX;
        $scope.MONEY_REGEX = MONEY_REGEX;
        $scope.nonExpandingIndex = '0'; // Needed for hiding custom start frame checkbox

        var types = [
            { id: 'IBV', name: 'In-Banner Video', dbName: 'In-Banner' },
            { id: 'ISV', name: 'In-Stream Video', dbName: 'In-Stream' },
            { id: 'RM', name: 'Rich Media', dbName: 'Rich Media' },
            { id: 'SWF', name: 'Display: SWF', dbName: 'Display' },
            { id: 'IMG', name: 'Display: Image', dbName: 'Display' }
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
            { id: 'multidevice', name: 'Multi-Screen (Desktop, Tablet and Phone)' },
            { id: 'desktop', name: 'Desktop' },
            { id: 'tablet', name: 'Tablet & Phone' },
            { id: 'mobile', name: 'Tablet & Phone (In-App/MRAID)' }
        ];

        var dimensions = [
            { width: 160, height: 600, name: '160x600' },
            { width: 180, height: 150, name: '180x150' },
            { width: 300, height: 250, name: '300x250' },
            { width: 300, height: 600, name: '300x600' },
            { width: 728, height: 90, name: '728x90' },
            { width: 480, height: 360, name: '480x360 (4:3)' },
            { width: 533, height: 300, name: '533x300 (16:9)' },
            { width: 640, height: 360, name: '640x360 (16:9)' },
            { width: 640, height: 480, name: '640x480 (4:3)' },
            { width: 768, height: 432, name: '768x432 (16:9)' },
            { width: 728, height: 90, name: '728x90' },
            { width: 970, height: 90, name: '970x90' },
            { width: 1, height: 1, name: 'Interstitial 1x1' },
            { isCustom: true, name: 'Custom' }
        ];

        var expandedDimensions = [
            { isNonExpanding: true, name: 'Non-Expanding' },
            { width: 300, height: 600, name: '300x600' },
            { width: 560, height: 300, name: '560x300' },
            { width: 600, height: 250, name: '600x250' },
            { width: 600, height: 600, name: '600x600' },
            { width: 728, height: 315, name: '728x315' },
            { width: 970, height: 250, name: '970x250' },
            { width: 970, height: 415, name: '970x415' },
            { isCustom: true, name: 'Custom' }
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
                        dimensions[$scope.creative.dimensions].isCustom;
                }
            });

            $scope.$watch('creative.expandedDimensions', function() {
                if ($scope.creative && $scope.creative.expandedDimensions) {
                    $scope.expandedDimensionsAreCustom =
                        expandedDimensions[$scope.creative.expandedDimensions].isCustom;
                }
            });
        }

        function setupModalLogic() {
            var record;

            if(modalState.creativeId) {
                record = creativeRecordService.get(modalState.creativeId);
                creativeRecordService.fetch(modalState.creativeId);
            } else {
                record = creativeRecordService.create();
                record.set(modalState.creative);
            }

            record.observe(update, $scope);

            function update() {
                $scope.creative = transformDatabaseToModal(record.get());
                $scope.errors = record.errors();
            }

            campaigns.observe(updateCampaigns, $scope);

            function updateCampaigns() {
                if(!modalState.creativeId) {

                    // TODO: add render limit so this isn't crazy slow
                    //$scope.campaigns = campaigns.all().slice(0, 10);
                    $scope.campaigns = [{id: '1c5cf047-5ecd-444b-822a-17e1eebed4b3', name: 'test'}];
                }
            }

            $scope.cancel = function() {
                if(record.hasChanges()) {
                    if(confirm('You have unsaved changes. Really close?')) {
                        record.reset();
                        $scope.campaign = record.get();
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    $modalInstance.dismiss('cancel');
                }
            };

            $scope.ok = function(errors) {
                if(ng.equals({}, errors) || !errors) {
                    var transformedCreative = transformModalToDatabase();
                    var onSuccess = function(resp) {
                        $scope.creative = {};
                        notification.success('Creative: {{name}}, has been updated.',
                            {
                                locals: {
                                    name: resp.data.name
                                }
                            });
                        $modalInstance.dismiss('cancel');
                    };

                    if (record.isNew()) {
                        newCreativeService(transformedCreative)
                            .then(function(url) {
                                $scope.creative = {};
                                $modalInstance.dismiss('cancel');
                                $window.open(url, '_blank');
                            });
                    } else {
                        record.save().then(onSuccess);
                    }
                }
                $scope.submitted = true;
            };

            function transformModalToDatabase() {
                var creative = $scope.creative;
                var allDimensions = getDatabaseDimensions(creative);
                return {
                    expandedWidth: allDimensions.expanded && parseInt(allDimensions.expanded.width, 10),
                    expandedHeight: allDimensions.expanded && parseInt(allDimensions.expanded.height, 10),
                    embedWidth: parseInt(allDimensions.embed.width, 10),
                    embedHeight: parseInt(allDimensions.embed.height, 10),
                    clickthroughUrl: creative.clickthroughUrl,
                    type: creative.type,
                    environment: environments[creative.environment].id,
                    name: creative.name
                };
            }

            function transformDatabaseToModal(dbCreative) {
                var modalCreative = ng.copy(dbCreative);

                // type
                types.forEach(function(type) {
                   if (type.dbName === dbCreative.type) {
                       modalCreative.type = type.id;
                   }
                });

                // environment
                environments.forEach(function(environment, index) {
                    if (environment.id === dbCreative.device) {
                        modalCreative.environment = index;
                    }
                });
                var getModalDimensions = function(collection, width, height) {
                    var customIndex, isNonExpanding, nonExpandingIndex, foundIndex;
                    if (width === null || height === null) {
                        isNonExpanding = true;
                    }
                    collection.forEach(function(item, index) {
                        if (item.width === width && item.height === height) {
                            foundIndex = index;
                        } else if (item.isCustom) {
                            customIndex = index;
                        } else if (item.isNonExpanding) {
                            nonExpandingIndex = index;
                        }
                    });

                    if (isNonExpanding) {
                        return nonExpandingIndex;
                    } else {
                        return foundIndex || customIndex;
                    }
                };

                // dimensions
                modalCreative.dimensions = getModalDimensions(
                    dimensions, dbCreative.embedWidth, dbCreative.embedHeight
                );

                modalCreative.customDimensionsWidth = dbCreative.embedWidth;
                modalCreative.customDimensionsHeight = dbCreative.embedHeight;

                // expanded dimensions
                modalCreative.expandedDimensions = getModalDimensions(
                    expandedDimensions, dbCreative.expandedWidth, dbCreative.expandedHeight
                );

                modalCreative.customExpandedDimensionsWidth = dbCreative.expandedWidth;
                modalCreative.customExpandedDimensionsHeight = dbCreative.expandedHeight;

                return modalCreative;
            }

            function getDatabaseDimensions(creative) {
                var allDimensions = {
                    embed: {},
                    expanded: {}
                };

                var creativeDimensions = dimensions[creative.dimensions];
                allDimensions.embed.width = creativeDimensions.width;
                allDimensions.embed.height = creativeDimensions.height;

                allDimensions.embed = {
                    width: allDimensions.embed.width || creative.customDimensionsWidth,
                    height: allDimensions.embed.height || creative.customDimensionsHeight
                };

                if (creative.expandedDimensions) {
                    creativeDimensions = expandedDimensions[creative.expandedDimensions];
                    allDimensions.expanded.width = creativeDimensions.width;
                    allDimensions.expanded.height = creativeDimensions.height;

                    allDimensions.expanded = {
                        width: allDimensions.expanded.width || creative.customExpandedDimensionsWidth,
                        height: allDimensions.expanded.height || creative.customExpandedDimensionsHeight
                    };
                }

                return allDimensions;
            }

            //Before closing the modal save the state;
            $scope.$on('$destroy', function() {
                modalState.creative = $scope.creative;
            });
        }
    }]);
});
