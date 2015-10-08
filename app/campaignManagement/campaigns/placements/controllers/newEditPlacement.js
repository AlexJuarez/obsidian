/* globals confirm */
define(function(require) {
	'use strict';

	var app = require('./../../../module');

	var ng = require('angular');

	app.controller('newEditPlacementCtrl', [
		'$scope', '$q', '$modalInstance', '$timeout', 'placements',
		'placementRecordService', 'modalState',
		function($scope, $q, $modalInstance, $timeout, placements,
						 placementRecordService, modalState) {

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
				for(var i = 0; i < modalState.placementIds.length; i ++) {
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
			if(modalState.originalPlacement.campaignId) {
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
				if(ng.equals({}, errors) || ! errors) {
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
				if(record.hasChanges()) {
					if(confirm('You have unsaved changes. Really close?')) {
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
		}
	]);
});
