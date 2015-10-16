/* globals confirm */
/* jshint maxstatements:false */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX',
         'CREATIVE_SETTINGS', 'notification', 'studioLocation', 'studioUrlBuilder', 'studioWindow',
    function ($scope, $modalInstance, newCreativeService, creatives, campaigns,
              creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX,
              creativeSettings, notification, studioLocation, studioUrlBuilder, studioWindow
    ) {
        var _mediaItem;
        function setMediaItem(mediaItem) {
            _mediaItem = mediaItem;
            // update visuals
        }

        $scope.selectMedia = function() {
            // Create window that hosts Studio Direct
            var hostname = studioLocation.host();
            var url =  studioUrlBuilder.mediaselect($scope.creative.campaignId)
                .setHostname(hostname)
                .build();
            var studioTab = studioWindow.open(url);
            studioTab.onClose = function onClose(code, detail) {
                if(code && detail) {
                    // so jshint shuts up
                }
                studioTab.close();
            };
            studioTab.onMediaSelect = function onMediaSelect(uuid, detail) {
                if(!!uuid) {
                    var json = JSON.parse(detail);
                    setMediaItem(json);
                }
            };
        };

        var record;

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.dimensionsTransform = dimensionsTransform;
        $scope.dimensionsExpandTransform = dimensionsExpandTransform;
        $scope.environmentTransform = environmentTransform;
        $scope.typeTransform = typeTransform;
        $scope.action = modalState.action;
        $scope.swfAllowedExtensions = ['swf'];
        $scope.URL_REGEX = URL_REGEX;
        $scope.MONEY_REGEX = MONEY_REGEX;
        $scope.nonExpandingIndex = '0'; // Needed for hiding custom start frame checkbox

        $scope.types = creativeSettings.types;

        function getType(data){
            var type;

            ng.forEach(creativeSettings.types, function(d) {
                if (data.type === d.dbName && data.subtype === d.subtype) {
                    type = d;
                }
            });

            return type;
        }

        function typeTransform(type) {
            if (type) {
                record.set({ type: type.dbName, subtype: type.subtype });

                var settings = creativeSettings.typeSettings[type.id];
                updateEnvironments(settings.environments);
                updateDimensions(settings.dimensions);
                updateExpandedDimensions(settings.expandedDimensions);
            }

            return getType(record.get());
        }

        function updateEnvironments(enabledEnvironmentIds) {
            $scope.environments = filterById(creativeSettings.environments, enabledEnvironmentIds);
        }

        function updateDimensions(enabledDimensionIds) {
            $scope.dimensions = filterById(creativeSettings.dimensions, enabledDimensionIds);
        }

        function updateExpandedDimensions(enabledExpandedDimensionIds) {
            $scope.expandedDimensions = filterById(creativeSettings.expandedDimensions, enabledExpandedDimensionIds);
        }

        function filterById(options, idArray) {
            if (typeof idArray === 'undefined') {
                return undefined;
            } else {
                var filtered = [];
                var id;
                for (var i = 0; i < idArray.length; i++) {
                    id = idArray[i];
                    filtered.push(options[id]);
                }
                return filtered;
            }
        }

        function getDimensionsValue(arry, width, height) {
            var index;
            var customIndex;
            var nonExpandingIndex;

            ng.forEach(arry, function(d) {
                if (width === d.width && height === d.height) {
                    index = d.id;
                }
                if (d.isCustom) {
                    customIndex = d.id;
                }
                if (d.isNonExpanding) {
                    nonExpandingIndex = d.id;
                }
            });

            if (!width || !height) {
                return arry[nonExpandingIndex];
            }

            return arry[index == null ? customIndex : index];
        }

        function dimensionsTransform(dimension) {
            if (dimension) {
                $scope.dimensionsAreCustom = dimension.isCustom;

                if (!dimension.isCustom) {
                    record.set({
                        embedWidth: dimension.width,
                        embedHeight: dimension.height
                    });
                }
            }

            return getDimensionsValue(creativeSettings.dimensions, record.get().embedWidth, record.get().embedHeight);
        }

        function dimensionsExpandTransform(dimension) {
            if (dimension) {
                $scope.expandedDimensionsAreCustom = dimension.isCustom;

                if (!dimension.isCustom || !dimension.isNonExpanding) {
                    record.set({
                        expandedWidth: dimension.width,
                        expandedHeight: dimension.height
                    });
                }

                if(dimension.isNonExpanding) {
                    record.set({
                        expandedWidth: null,
                        expandedHeight: null,
                        expandMode: null
                    });
                }
            }

            return getDimensionsValue(creativeSettings.expandedDimensions, record.get().expandedWidth, record.get().expandedHeight);
        }

        function getEnvironmentValue(environments, data) {
            var index;
            ng.forEach(environments, function(environment) {
                if (environment.dbName === data.environment) {
                    index = environment.id;
                }
            });

            return environments[index];
        }

        function environmentTransform(environment) {
            if (environment) {
                record.set({
                    environment: environment.dbName
                });
            }
            return getEnvironmentValue(creativeSettings.environments, record.get());
        }

        if(modalState.creativeId) {
            $scope.editing = true;
            record = creativeRecordService.get(modalState.creativeId);
            creativeRecordService.fetch(modalState.creativeId);
        } else {
            record = creativeRecordService.create();
            record.set(modalState.creative);
        }

        record.observe(update, $scope);

        function update() {
            $scope.creative = record.get();
            $scope.errors = record.errors();
            var type = getType(record.get());
            if (type) {
                var settings = creativeSettings.typeSettings[type.id];
                updateEnvironments(settings.environments);
                updateDimensions(settings.dimensions);
                updateExpandedDimensions(settings.expandedDimensions);
            }
            var dimension = getDimensionsValue(creativeSettings.dimensions, record.get().embedWidth, record.get().embedHeight);
            if (dimension) {
                $scope.dimensionsAreCustom = dimension.isCustom;
            }
            var dimensionExpanded = getDimensionsValue(creativeSettings.expandedDimensions, record.get().expandedWidth, record.get().expandedHeight);
            if (dimensionExpanded) {
                $scope.expandedDimensionsAreCustom = dimensionExpanded.isCustom;
            }
        }

        campaigns.observe(updateCampaigns, $scope);

        function updateCampaigns() {
            if(!modalState.creativeId) {
                $scope.campaigns = campaigns.all();
            }
        }

        function cancel() {
            if(record.hasChanges()) {
                if(confirm('You have unsaved changes. Really close?')) {
                    record.reset();
                    $scope.campaign = record.get();
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        }

        function ok(errors) {
            if(ng.equals({}, errors) || !errors) {
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
                    newCreativeService($scope.creative, _mediaItem)
                        .then(function() {
                            $scope.creative = {};
                            $modalInstance.dismiss('cancel');
                        });
                } else {
                    record.save()
                        .then(onSuccess);
                }
            }
            $scope.submitted = true;
        }

        //Before closing the modal save the state;
        $scope.$on('$destroy', function() {
            modalState.creative = $scope.creative;
        });
    }]);
});
