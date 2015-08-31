/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../../module');

    var ng = require('angular');

    app.controller('newEditPlacementCtrl', ['$scope', '$q', '$modalInstance', 'placements',
                                            'placementRecordService', 'campaignRecordService',
                                            'accountRecordService', 'divisionRecordService',
                                            'clientRecordService', 'clientPublisherRecordService', 'modalState',
                                            function ($scope, $q, $modalInstance, placements,
                                                      placementRecordService, campaignRecordService,
                                                      accountRecordService, divisionRecordService,
                                                      clientRecordService, clientPublisherRecordService, modalState) {
        $scope.placement = modalState.placement;
        $scope.action = modalState.action;

        setupDatePickers();
        setupRateTypes();
        setupModal();

        function setupDatePickers() {
            var openPicker = function($event, name) {
                $event.preventDefault();
                $event.stopPropagation();

                ng.forEach($scope.datePickers, function (value, key) {
                    $scope.datePickers[key] = false;
                });

                $scope.datePickers[name] = true;
            };

            $scope.format = 'MM/dd/yyyy';
            $scope.openPicker = openPicker;
            $scope.datePickers = {};
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 0,
                maxMode: 'day'
            };
        }

        function setupRateTypes() {
            $scope.rateTypes = [
                {id: 'CPM', name: 'CPM'},
                {id: 'CPC', name: 'CPC'},
                {id: 'CPV', name: 'CPV'},
                {id: 'CPCV', name: 'CPCV'},
                {id: 'FIXED', name: 'Fixed Fee'},
                {id: 'ADDEDV', name: 'Added Value'}
            ];

            $scope.rateTypeFields = {
                CPM: { showCostPer: true, showTotalCost: true },
                CPC: { showCostPer: true, showTotalCost: true },
                CPV: { showCostPer: true, showTotalCost: true },
                CPCV: { showCostPer: true, showTotalCost: true },
                FIXED: { showCostPer: false, showTotalCost: true },
                ADDEDV: { showCostPer: false, showTotalCost: false }
            };

            $scope.$watch('placement.rateType', function() {
                var rateType = $scope.placement && $scope.placement.rateType;
                if (rateType) {
                    var fields = $scope.rateTypeFields[rateType];
                    if(fields) {
                        $scope.showCostPer = fields.showCostPer;
                        $scope.showTotalCost = fields.showTotalCost;
                    }
                }
            });
        }

        function setupModal() {
            var originalPlacement;
            var placementPromises = [];

            // Editing placement(s)
            if (modalState.placementIds) {
                $scope.multiplePlacements = modalState.placementIds.length > 1;

                for (var i=0; i<modalState.placementIds.length; i++) {
                    placementPromises.push(
                        placementRecordService.getById(modalState.placementIds[i])
                    );
                }

                $q.all(placementPromises).then(function(placements) {
                    updatePublishers(placements[0].all().campaignId);
                    originalPlacement = getSameProperties(placements);
                    addDefaults(originalPlacement);
                    if (!$scope.placement || $scope.placement === {}) {
                        $scope.placement = ng.copy(originalPlacement);
                    }
                });
            }

            // Creating a new placement under a campaign
            if (modalState.campaignId) {

                updatePublishers(modalState.campaignId);

                if (!originalPlacement) {
                    originalPlacement = addDefaults({});
                }

                if (!$scope.placement) {
                    $scope.placement = originalPlacement;
                }

                $scope.placement.campaignId = originalPlacement.campaignId = modalState.campaignId;
            }

            /**
             * Returns an object filled with the equal properties of all the objects
             * in the placements array
             *
             * @param placements {Array<Object>}
             */
            function getSameProperties(placements) {

                if (placements.length === 1) {
                    return placements[0].all();
                }

                var sameProperties = placements.pop().all();
                var tmpSameProperties;
                var currentPlacement;

                for (var i=0; i<placements.length; i++) {
                    currentPlacement = placements[i].all();
                    tmpSameProperties = {};
                    for (var index in currentPlacement) {
                        if (currentPlacement.hasOwnProperty(index)) {
                            if (ng.equals(sameProperties[index], currentPlacement[index])) {
                                tmpSameProperties[index] = sameProperties[index];
                            }
                        }
                    }
                    sameProperties = tmpSameProperties;
                }

                return sameProperties;
            }

            function addDefaults(placement) {
                ng.extend(placement, {
                    flightStart: placement.flightStart || new Date(),
                    flightEnd: placement.flightEnd || new Date()
                });
            }

            function updatePublishers(campaignId) {
                campaignRecordService.getById(campaignId)
                    .then(function(campaign) {
                        accountRecordService.getById(campaign.all().accountId)
                            .then(function(account) {
                                divisionRecordService.getById(account.all().divisionId)
                                    .then(function(division) {
                                        clientRecordService.getById(division.all().clientId)
                                            .then(function(client) {
                                                clientPublisherRecordService.getById(client.all().id)
                                                    .then(function(publishers) {
                                                        $scope.publishers = publishers.all();
                                                    });
                                            });
                                    });
                            });
                    });
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
        }
    }]);
});
