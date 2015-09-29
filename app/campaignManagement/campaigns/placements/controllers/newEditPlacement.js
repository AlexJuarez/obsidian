/* globals confirm */
define(function (require) {
    'use strict';

    var app = require('./../../../module');

    var ng = require('angular');

    app.controller('newEditPlacementCtrl', [
        '$scope', '$q', '$modalInstance', '$timeout', '$filter', 'placements',
        'placementRecordService', 'campaignRecordService',
        'accountRecordService', 'divisionRecordService',
        'clientRecordService', 'clientPublisherRecordService',
        'modalState', 'creatives',
    function ($scope, $q, $modalInstance, $timeout, $filter, placements,
            placementRecordService, campaignRecordService,
            accountRecordService, divisionRecordService,
            clientRecordService, clientPublisherRecordService,
            modalState, creativeService) {

        $scope.ok = ok;
        $scope.cancel = cancel;
        $scope.action = modalState.action;
        $scope.multiplePlacements = modalState.placementIds.length > 1;
        $scope.formatDate = formatDate;

        var records = [];
        var record;

        setupDatePickers();
        setupRateTypes();
        setupPickCreative();
        setupModal();

        creativeService.observe(setupPickCreative, $scope);

        function setupDatePickers() {
            $scope.format = 'MM/dd/yyyy';
            $scope.openPicker = openPicker;
            $scope.datePickers = {};
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 0,
                maxMode: 'day'
            };

            function openPicker($event, name) {
                $event.preventDefault();
                $event.stopPropagation();

                ng.forEach($scope.datePickers, function (value, key) {
                    $scope.datePickers[key] = false;
                });

                $scope.datePickers[name] = true;
            }
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

        function setupPickCreative() {
            var adTypes = {};
            var creatives = creativeService.data().all();

            creatives.forEach(function(creative) {
                if (!adTypes[creative.type]) {
                    adTypes[creative.type] = [];
                }

                adTypes[creative.type].push(creative);
            });

            $scope.creativesByAdType = adTypes;
        }

        function setupModal() {
            var placementPromises = [];
            var r, id;
            // Editing placement(s)
            if (modalState.placementIds) {
                for (var i=0; i<modalState.placementIds.length; i++) {
                    id = modalState.placementIds[i];
                    r = placementRecordService.get(id);
                    placementPromises.push(placementRecordService.fetch(id));
                    records.push(r);
                }

                $q.all(placementPromises).then(function() {
                    record = placementRecordService.create(ng.merge(getIntersection(records), modalState.originalPlacement));
                    record.observe(update, $scope);
                });
            }

            // Creating a new placement under a campaign
            if (modalState.campaignId) {
                record = placementRecordService.create(modalState.originalPlacement);
                record.set(modalState.placement);
                record.observe(update, $scope);
            }

            function update() {
                $scope.placement = record.get();
                $scope.errors = record.errors();
                updatePublishers(record.get().campaignId);
            }

            /**
             * Returns an object filled with the equal properties of all the objects
             * in the placements array
             *
             * @param placements {Array<Object>}
             */
            function getIntersection(placements) {
                var intersection = placements.pop().get();
                var curr;

                for (var i=0; i<placements.length; i++) {
                    curr = placements[i];
                    intersection = curr.intersect(intersection, curr.get())
                }

                return intersection;
            }

            function updatePublishers(campaignId) {
                campaignRecordService.fetch(campaignId)
                    .then(function(resp) {
                        accountRecordService.fetch(resp.data.accountId)
                            .then(function(resp) {
                                divisionRecordService.fetch(resp.data.divisionId)
                                    .then(function(resp) {
                                        clientRecordService.fetch(resp.data.clientId)
                                            .then(function(resp) {
                                                clientPublisherRecordService.fetch(resp.data.id)
                                                    .then(function(resp) {
                                                        $scope.publishers = resp.data;
                                                    });
                                            });
                                    });
                            });
                    });
            }
        }

        function ok(errors) {
            if (ng.equals({}, errors) || !errors) {
                var onSuccess = function() {
                    $scope.placement = {};
                    $modalInstance.dismiss('cancel');
                };

                if(records.length) {

                } else {
                    record.save().then(onSuccess);
                }
            }
            $scope.submitted = true;
        }

        function cancel() {
            if (record.hasChanges()) {
                if (confirm('You have unsaved changes. Really close?')) {
                    record.reset();
                    $scope.placement = record.get();
                    $modalInstance.dismiss('cancel');
                }
            } else {
                $modalInstance.dismiss('cancel');
            }
        }

        $scope.$on('$destroy', function() {
            modalState.placement = $scope.placement;
        });

        function formatDate($event) {
            var date = new Date($event.target.value);
            if (isNaN( date.getTime() )) {

                // Date doesn't parse!
                date = new Date('Jan 1 2000');
            }
            $event.target.value = $filter('date')(date, 'M/d/yyyy');
        }
    }]);
});
