/* globals confirm */
/* jshint maxstatements:false */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX',
         'CREATIVE_SETTINGS', 'notification',
    function ($scope, $modalInstance, newCreativeService, creatives, campaigns,
              creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX,
              creativeSettings, notification
    ) {
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

        function getTypeId(data){
            var index;

            ng.forEach(creativeSettings.types, function(d) {
                if (data.type === d.dbName && data.subtype === d.subtype) {
                    index = d.id;
                }
            });

            return index;
        }

        function typeTransform(type) {
            if (type) {
                record.set({ type: type.dbName, subtype: type.subtype });

                var settings = creativeSettings.typeSettings[type.id];
                updateEnvironments(settings.environments);
                updateDimensions(settings.dimensions);
                updateExpandedDimensions(settings.expandedDimensions);
            }

            return getTypeId(record.get());
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
                return nonExpandingIndex;
            }

            return index == null ? customIndex : index;
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

            return index;
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
            var typeId = getTypeId(record.get());
            if (typeId) {
                var settings = creativeSettings.typeSettings[typeId];
                updateEnvironments(settings.environments);
                updateDimensions(settings.dimensions);
                updateExpandedDimensions(settings.expandedDimensions);
            }
            var dimensionId = getDimensionsValue(creativeSettings.dimensions, record.get().embedWidth, record.get().embedHeight);
            if (dimensionId) {
                $scope.dimensionsAreCustom = creativeSettings.dimensions[dimensionId].isCustom;
            }
            var dimensionExpandedId = getDimensionsValue(creativeSettings.expandedDimensions, record.get().expandedWidth, record.get().expandedHeight);
            if (dimensionExpandedId) {
                $scope.expandedDimensionsAreCustom = creativeSettings.expandedDimensions[dimensionExpandedId].isCustom;
            }
        }

        campaigns.observe(updateCampaigns, $scope);

        function updateCampaigns() {
            if(!modalState.creativeId) {
                // TODO: add render limit so this isn't crazy slow
                //$scope.campaigns = campaigns.all().slice(0, 10);
                $scope.campaigns = [{id: '1c5cf047-5ecd-444b-822a-17e1eebed4b3', name: 'test'}];
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
                    newCreativeService($scope.creative)
                        .then(function(url) {
                            $scope.creative = {};
                            $modalInstance.dismiss('cancel');
                            $window.open(url, 'mixpo_studio');
                        });
                } else {
                    record.save().then(onSuccess);
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
