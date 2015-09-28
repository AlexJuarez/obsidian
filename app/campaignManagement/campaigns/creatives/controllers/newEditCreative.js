/* globals confirm */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX',
         'CREATIVE_SETTINGS', 'newEditModalTranslation', 'notification', '$timeout',
    function ($scope, $modalInstance, newCreativeService, creatives, campaigns,
              creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX,
              creativeSettings, translate, notification, $timeout
    ) {
        var record;

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.dimensionsTransform = dimensionsTransform;
        $scope.dimensionsExpandTransform = dimensionsExpandTransform;
        $scope.action = modalState.action;
        $scope.swfAllowedExtensions = ['swf'];
        $scope.URL_REGEX = URL_REGEX;
        $scope.MONEY_REGEX = MONEY_REGEX;
        $scope.nonExpandingIndex = '0'; // Needed for hiding custom start frame checkbox

        setupTranslationLogic();

        function setupTranslationLogic() {
            // Update available environments, dimensions and expanded dimensions
            // based on creative types and the settings above
            $scope.types = creativeSettings.types;
            $scope.$watch('creative.type', updateType);

            function updateType() {
                if ($scope.creative && creativeSettings.typeSettings[$scope.creative.type]) {
                    var settings = creativeSettings.typeSettings[$scope.creative.type];
                    updateEnvironments(settings.environments);
                    updateDimensions(settings.dimensions);
                    updateExpandedDimensions(settings.expandedDimensions);
                }
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

            $scope.$watch('creative.expandedDimensions', function() {
                if ($scope.creative && $scope.creative.expandedDimensions) {
                    $scope.expandedDimensionsAreCustom =
                      creativeSettings.expandedDimensions[$scope.creative.expandedDimensions].isCustom;
                }
            });
        }

        function getDimensionsValue(arry, width, height) {
            var index;
            var customIndex;

            ng.forEach(arry, function(d) {
                if (width === d.width && height === d.height) {
                    index = d.id;
                }
                if (d.isCustom) {
                    customIndex = d.id
                }
            });

            return index == null ? customIndex : index;
        }

        function dimensionsTransform(dimension) {
            if (arguments.length) {
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
            if (arguments.length) {
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
                    })
                }
            }

            return getDimensionsValue(creativeSettings.expandedDimensions, record.get().expandedWidth, record.get().expandedHeight);
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
            $scope.dbCreative = record.get();
            $scope.creative = translate.db2Modal($scope.dbCreative);
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
                $scope.dbCreative = translate.modal2Db($scope.creative);
                var onSuccess = function(resp) {
                    $scope.creative = {};
                    $scope.dbCreative = {};
                    notification.success('Creative: {{name}}, has been updated.',
                        {
                            locals: {
                                name: resp.data.name
                            }
                        });
                    $modalInstance.dismiss('cancel');
                };

                if (record.isNew()) {
                    newCreativeService($scope.dbCreative)
                        .then(function(url) {
                            $scope.creative = {};
                            $scope.dbCreative = {};
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
