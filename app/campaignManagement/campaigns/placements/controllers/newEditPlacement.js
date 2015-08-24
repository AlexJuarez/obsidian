/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../../module');

    var ng = require('angular');

    app.controller('newEditPlacementCtrl', ['$scope', '$modalInstance', 'placementRecordService', 'modalState', function ($scope, $modalInstance, placementRecordService, modalState) {
        $scope.placement = modalState.placement;
        $scope.action = modalState.action;

        var originalPlacement;

        // Editing a placement
        if (modalState.placementId) {
            placementRecordService.getById(modalState.placementId).then(function(placement) {
                originalPlacement = placement.all();
                if (!$scope.placement || $scope.placement === {}) {
                    $scope.placement = ng.copy(originalPlacement);
                }
            });
        }

        // Creating a new placement under a campaign
        if (modalState.campaignId) {
            if (!$scope.placement) {
                $scope.placement = {};
            }
            if (!originalPlacement) {
                originalPlacement = {};
            }
            $scope.placement.campaignId = originalPlacement.campaignId = modalState.campaignId;
        }

        $scope.ok = function (errors) {
            $scope.errors = errors;
            if (ng.equals({}, $scope.errors) || !$scope.errors) {
                var onSuccess = function() {
                    originalPlacement = $scope.placement;
                    $modalInstance.dismiss('cancel');
                };
                if($scope.placement && $scope.placement.id) {
                    var placementDiff = getDiff($scope.placement, originalPlacement);

                    if (!ng.equals(placementDiff, {})) {
                        placementRecordService.update($scope.placement.id, placementDiff).then(onSuccess);
                    } else {
                        $modalInstance.dismiss('cancel');
                    }
                } else {
                    placementRecordService.create($scope.placement).then(onSuccess);
                }
            }
            $scope.submitted = true;
        };


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

        $scope.cancel = function () {
            if (hasUnsavedChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    $scope.placement = ng.copy(originalPlacement);
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        };

        function hasUnsavedChanges() {
            return !ng.equals(originalPlacement, $scope.placement);
        }

        $scope.$on('$destroy', function() {
            modalState.placement = $scope.placement;
        });

    }]);
});
