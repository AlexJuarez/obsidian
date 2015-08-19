/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../module');
    var ng = require('angular');

    app.controller('newEditCreativeCtrl', ['$scope', '$modalInstance', 'creatives', 'campaignService', 'creativeRecordService', 'modalState', function ($scope, $modalInstance, creatives, campaigns, creativeRecordService, modalState) {

        //Datepicker functions
        $scope.format = 'MM/dd/yyyy';
        $scope.openPicker = openPicker;
        $scope.datePickers = {};

        //Modal functions
        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.creative = modalState.creative;
        $scope.action = modalState.action;

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

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 0,
            maxMode: 'day'
        };

        campaigns.observe(updateCampaigns, $scope);

        function updateCampaigns() {
            if (!modalState.creativeId) {
                $scope.campaigns = campaigns.filtered();
            }
        }

        function openPicker($event, name) {
            $event.preventDefault();
            $event.stopPropagation();

            ng.forEach($scope.datePickers, function (value, key) {
                $scope.datePickers[key] = false;
            });

            $scope.datePickers[name] = true;
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
