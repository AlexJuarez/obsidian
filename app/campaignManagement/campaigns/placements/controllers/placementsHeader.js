'use strict';

define(function(require) {
	var app = require('./../../../module');

	app.controller('placementsHeader', [
		'$scope', '$modal', '$rootScope', '$state', 'placements', 'adTags',
		function($scope, $modal, $rootScope, $state, placements, adTags) {

			$scope.openNewPlacementModal = openNewPlacementModal;
			$scope.editPlacements = editPlacements;
			$scope.pullTags = adTags.pullTags;
			$scope.selectedPlacements = [];

			var newPlacementModal;

			function openNewPlacementModal() {
				if(! newPlacementModal) {
					newPlacementModal = {
						action: 'New',
						originalPlacement: {
							campaignId: $state.params.campaignId,
							flightStart: new Date(),
							flightEnd: new Date()
						}
					};
				}

				$modal.open({
					animation: 'true',
					templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
					controller: 'newEditPlacementCtrl',
					resolve: {
						modalState: function() {
							return newPlacementModal;
						}
					},
					size: 'lg'
				});
			}

			function update() {
				updateMeta();
				updateSelected();
			}

			function updateMeta() {
				var allPlacements = placements.all(true);

				if(allPlacements) {
					var placement;
					var creative;

					var publishers = [];
					var creatives = [];
					var types = [];

					for(var i = 0; i < allPlacements.length; i ++) {
						placement = allPlacements[i];

						pushUnique(publishers, placement.publisher.id);
						pushUnique(types, placement.type);

						if(placement.creatives) {
							for(var k = 0; k < placement.creatives.length; k ++) {
								creative = placement.creatives[k];

								pushUnique(creatives, creative.id);

							}
						}
					}

					$scope.placementsMeta = {
						publishers: publishers.length,
						creatives: creatives.length,
						types: types.length
					};
				}
			}

			function updateSelected() {
				$scope.selectedPlacements = placements.getSelectedPlacementIds();
			}

			updateMeta();
			placements.observe(update, $scope, true);

			// Edit Placements
			var editPlacementsModal, selectedPlacements;

			function editPlacements() {
				if(! editPlacementsModal || selectedPlacementsChanged()) {
					selectedPlacements = $scope.selectedPlacements;
					editPlacementsModal = {
						placementIds: $scope.selectedPlacements,
						originalPlacement: {
							flightStart: new Date(),
							flightEnd: new Date()
						},
						action: 'Edit'
					};
				}

				$modal.open({
					animation: 'true',
					templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
					controller: 'newEditPlacementCtrl',
					resolve: {
						modalState: function() {
							return editPlacementsModal;
						}
					},
					size: 'lg'
				});
			}

			function selectedPlacementsChanged() {
				return arraysAreDifferent(selectedPlacements, $scope.selectedPlacements);
			}

			/**
			 * Push an item to an array if the item isn't already in the array
			 * @param array
			 * @param item
			 */
			function pushUnique(array, item) {
				if(! inArray(item, array)) {
					array.push(item);
				}
			}

			function inArray(needle, haystack) {
				return haystack.indexOf(needle) > - 1;
			}

			/**
			 * Returns true if two arrays are different
			 *
			 * @param a {Array<number>}
			 * @param b {Array<number>}
			 *
			 * @returns {boolean}
			 */
			function arraysAreDifferent(a, b) {
				return ! isSubsetOf(a, b) || ! isSubsetOf(b, a);
			}

			/**
			 * Returns true if b is a subset of a
			 *
			 * @param a {Array<number>}
			 * @param b {Array<number>}
			 *
			 * @returns {boolean}
			 */
			function isSubsetOf(a, b) {
				var difference = a.filter(function(i) {
					return b.indexOf(i) < 0;
				});

				return difference.length === 0;
			}
		}
	]);
});
