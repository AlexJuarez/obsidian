/* globals confirm */
define(function (require) {
    'use strict';
    var app = require('./../../../module');
    var ng = require('angular');

    var types = [
        { id: 'IBV', name: 'In-Banner Video' }
    ];

    var typeSettings = {
        'IBV': {
            environments: [1,2,3,4],
            dimensions: [1,2,3,4,11,12,13,14],
            expandedDimensions: [1,2,3,4,5,6,7,8,9,10]
        }
    };

    var environments = {
        1: { id: 'multi-screen', name: 'Multi-Screen (Desktop, Tablet and Phone)' },
        2: { id: 'desktop', name: 'Desktop' },
        3: { id: 'mobile', name: 'Tablet & Phone' },
        4: { id: 'mraid', name: 'Tablet & Phone (In-App/MRAID)' }
    };

    var dimensions = {
        1: { dimensions: [160, 600], name: '160x600' },
        2: { dimensions: [180, 150], name: '180x150' },
        3: { dimensions: [300, 250], name: '300x250' },
        4: { dimensions: [300, 600], name: '300x600' },
        5: { dimensions: [728, 90], name: '728x90' },
        6: { dimensions: [480, 360], name: '480x360 (4:3)' },
        7: { dimensions: [533, 300], name: '533x300 (16:9)' },
        8: { dimensions: [640, 360], name: '640x360 (16:9)' },
        9: { dimensions: [640, 480], name: '640x480 (4:3)' },
        10: { dimensions: [768, 432], name: '768x432 (16:9)' },
        11: { dimensions: [728, 90], name: '728x90' },
        12: { dimensions: [970, 90], name: '970x90' },
        13: { dimensions: [1, 1], name: 'Interstitial 1x1' },
        14: { name: 'Custom' }
    };

    var expandedDimensions = {
        1: { name: 'Non-Expanding' },
        2: { name: 'Legacy' },
        3: { dimensions: [300, 600], name: '300x600' },
        4: { dimensions: [560, 300], name: '560x300' },
        5: { dimensions: [600, 250], name: '600x250' },
        6: { dimensions: [600, 600], name: '600x600' },
        7: { dimensions: [728, 315], name: '728x315' },
        8: { dimensions: [970, 250], name: '970x250' },
        9: { dimensions: [970, 415], name: '970x415' },
        10: { name: 'Custom' }
    };

    app.controller('newEditCreativeCtrl', ['$scope', '$modalInstance', 'enumService', 'creatives', 'campaignService', 'creativeRecordService', 'modalState', function ($scope, $modalInstance, enums, creatives, campaigns, creativeRecordService, modalState) {

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.creative = modalState.creative;
        $scope.action = modalState.action;
        $scope.environments = [];

        var dimensions, expandedDimensions;
        $scope.types = types;
        $scope.$watch('creative.type', function () {
            if ($scope.creative && $scope.creative.type) {
                var typeSettings = typeSettings[$scope.creative.type];
                updateEnvironments(typeSettings.environments);
            }
        });

        function updateEnvironments(environments) {
            var enabledEnvironments = [];
            var environmentId;
            var environment;
            for (var i=0; i<environments.length; i++) {
                environmentId = environments[i];
                environment = environments[environmentId];
                enabledEnvironments.push({ id: environment.id, name: environment.name });
            }
            $scope.environments = enabledEnvironments;
        }

        var originalCreative;

        if (modalState.creativeId) {
            creativeRecordService.getById(modalState.creativeId).then(function(creative) {
                originalCreative = creative.all();
                if (!$scope.creative || $scope.creative === {}) {
                    $scope.creative = ng.copy(modalState.creative || originalCreative);
                }
            });
        } else {
            originalCreative = {
                startDate: (modalState.creative && modalState.creative.startDate) || new Date(),
                endDate: (modalState.creative && modalState.creative.endDate) || new Date(),
                objectives: [],
                accountId: modalState.accountId
            };

            $scope.creative = ng.copy(modalState.creative || originalCreative);
        }

        campaigns.observe(updateCampaigns, $scope);

        function updateCampaigns() {
            if (!modalState.creativeId) {

                // TODO: add render limit so this isn't crazy slow
                $scope.campaigns = campaigns.all();
            }
        }

        function cancel() {
            if (hasUnsavedChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    $scope.creative = originalCreative;
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        }

        function hasUnsavedChanges() {
            return !ng.equals($scope.creative, originalCreative);
        }

        function ok(errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    originalCreative = $scope.creative;
                    $modalInstance.dismiss('cancel');
                };
                if($scope.creative && $scope.creative.id) {
                    var creativeDiff = getDiff($scope.creative, originalCreative);

                    if (!ng.equals(creativeDiff, {})) {
                        creativeRecordService.update($scope.creative.id, creativeDiff).then(onSuccess);
                    } else {
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    creativeRecordService.create($scope.creative).then(onSuccess);
                }
            }
            $scope.submitted = true;
        }

        // Simple diffing function for PUT request
        function getDiff(changed, original) {
            var diff = {};
            for (var index in changed) {
                if (changed.hasOwnProperty(index)) {
                    if (original[index] && !ng.equals(changed[index], original[index])) {
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
    }]);
});
