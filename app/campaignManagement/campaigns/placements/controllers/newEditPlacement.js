/* globals confirm */
define(function(require) {
	'use strict';

	var app = require('./../../../module');

	var ng = require('angular');

	app.controller('newEditPlacementCtrl', [
		'$scope', '$q', '$modalInstance', '$timeout', 'placements',
		'placementRecordService', 'modalState', 'notification',
		function($scope, $q, $modalInstance, $timeout, placements,
						 placementRecordService, modalState, notification) {

			$scope.numberRegex = /^[0-9]*$/;
			$scope.ok = ok;
			$scope.cancel = cancel;
			$scope.action = modalState.action;
			$scope.multiplePlacements = modalState.placementIds && modalState.placementIds.length > 1;

			var records = [];
			var record;
			var placementPromises = [];
			var r, id;

			// Editing placement(s)
			if(modalState.placementIds) {
				$scope.placement = {};
				for(var i = 0; i < modalState.placementIds.length; i ++) {
					id = modalState.placementIds[i];
					r = placementRecordService.get(id);
					placementPromises.push(r.fetch(id));
					records.push(r);
				}

                if (placementPromises.length === 1) {
                    record = records[0];
                    record.observe(update, $scope);
                } else {
                    $q.all(placementPromises).then(function() {
                        record = placementRecordService.create(ng.merge(getIntersection(records), modalState.originalPlacement));
                        record.observe(update, $scope);
                    });
                }
			}

			// Creating a new placement under a campaign
			if(modalState.originalPlacement && modalState.originalPlacement.campaignId) {
				record = placementRecordService.create(modalState.originalPlacement);
				record.set(modalState.placement);
				record.observe(update, $scope);
			}

			function update() {
				$scope.placement = record.get();
				$scope.errors = record.errors();
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

				for(var i = 0; i < placements.length; i ++) {
					curr = placements[i];
					intersection = curr.intersect(intersection, curr.get());
				}

				return intersection;
			}

			function ok(errors) {
				if ($scope.placement.takeoverLightboxOpacity) {
					$scope.placement.takeoverLightboxOpacity = parseInt($scope.placement.takeoverLightboxOpacity, 10);
				}
				if(ng.equals({}, errors) || ! errors) {
					var onSuccess = function(resp) {
						$scope.placement = {};
						notification.success('Placement {{name}} has been saved.',
							{
								locals: {
									name: resp.data.name
								}
							});
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
                console.log(record.changes());
				if(record.hasChanges()) {
					if(confirm('You have unsaved changes. Really close?')) {
						record.reset();
						$modalInstance.dismiss('cancel');
					}
				} else {
					$modalInstance.dismiss('cancel');
				}
			}

			$scope.$on('$destroy', function() {
				modalState.placement = record.changes();
			});
		}
	]);
});
