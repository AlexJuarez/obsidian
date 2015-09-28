/* globals confirm */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl',
        ['$scope', '$modalInstance', 'newCreativeService', 'creatives', 'campaignService',
         'creativeRecordService', 'modalState', '$window', 'URL_REGEX', 'MONEY_REGEX',
         'CREATIVE_SETTINGS', 'newEditModalTranslation', 'notification',
    function ($scope, $modalInstance, newCreativeService, creatives, campaigns,
              creativeRecordService, modalState, $window, URL_REGEX, MONEY_REGEX,
              creativeSettings, translate,
    notification) {

        //Modal functions
        $scope.ok = undefined;
        $scope.cancel = undefined;
        $scope.action = modalState.action;
        $scope.swfAllowedExtensions = ['swf'];
        $scope.URL_REGEX = URL_REGEX;
        $scope.MONEY_REGEX = MONEY_REGEX;
        $scope.nonExpandingIndex = '0'; // Needed for hiding custom start frame checkbox

        setupTranslationLogic();
        setupModalLogic();

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
                      creativeSettings.dimensions[$scope.creative.dimensions].isCustom;
                }
            });

            $scope.$watch('creative.expandedDimensions', function() {
                if ($scope.creative && $scope.creative.expandedDimensions) {
                    $scope.expandedDimensionsAreCustom =
                      creativeSettings.expandedDimensions[$scope.creative.expandedDimensions].isCustom;
                }
            });
        }

        function setupModalLogic() {
            var record;

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
            };

            //Before closing the modal save the state;
            $scope.$on('$destroy', function() {
                modalState.creative = $scope.creative;
            });
        }
    }]);
});
