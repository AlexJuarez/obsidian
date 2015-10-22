define(function (require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./assign-creative.html');

	app.directive('assignCreative', [function () {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/assign-creative.html',
			controller: ['$scope', 'creatives', 'ENUMS', function ($scope, creativeService, ENUMS) {

				$scope.expandTypes = ENUMS.up.expandTypes;
				$scope.playModes = ENUMS.up.playModes;
				$scope.vastMediaFileTypes = ENUMS.up.vastMediaFileTypes;
				$scope.vastMimeTypes = ENUMS.up.vastMimeTypes;

				// setup defaults
				$scope.placement.expandBeforeCountdown = $scope.placement.expandBeforeCountdown || true;
				$scope.placement.playMode = $scope.placement.playMode || $scope.playModes.rollover;
				$scope.placement.expandType = $scope.placement.expandType || $scope.expandTypes.directional;

				var creativeTypes = ENUMS.down.creativeTypes;

				creativeService.observe(updateCreativesByAdType, $scope);
				function updateCreativesByAdType() {

					var adTypes = {};
					adTypes[ENUMS.up.creativeTypes.inStream] = {name: 'In-Stream', creatives: []};
					adTypes[ENUMS.up.creativeTypes.inBannerVideo] = {name: 'In-Banner', creatives: []};
					adTypes[ENUMS.up.creativeTypes.richMedia] = {name: 'Rich Media', creatives: []};
					adTypes[ENUMS.up.creativeTypes.display] = {name: 'Image/SWF', creatives: []};

					var creatives = creativeService.data().all();

					creatives.forEach(function(creative) {
						if(! adTypes[creative.type]) {
							adTypes[creative.type] = [];
						}

						adTypes[creative.type].creatives.push(creative);
					});

					$scope.creativesByAdType = adTypes;
				}

				creativeService.observe(updateNonExpandingDefaultCreatives, $scope);
				function updateNonExpandingDefaultCreatives() {
					var nonExpandingCreatives = [];
					var creatives = creativeService.data().all();

					creatives.forEach(function(creative) {
						if (!isExpandingCreative(creative)) {
							nonExpandingCreatives.push(creative);
						}
					});
					$scope.nonExpandingCreatives = nonExpandingCreatives;
				}

				$scope.$watch('creative', function() {
					$scope.isExpanding = false;
					if ($scope.creative) {
						$scope.creativeType = creativeTypes[$scope.creative.type];
						if (isExpandingCreative($scope.creative)) {
							$scope.isExpanding = true;
						}

						$scope.placement.targetId = $scope.creative.id;
						$scope.placement.embedWidth = $scope.creative.embedWidth;
						$scope.placement.embedHeight = $scope.creative.embedHeight;

						// TODO: Set this to $scope.creative.clickthroughUrl once it's in the api
						$scope.placement.clickthroughUrl = $scope.creative.clickthroughUrl || 'http://www.mixpo.com';
					}
				});

				function isExpandingCreative(creative) {
					return !!creative.expandedWidth;
				}
			}]
		};
	}]);
});
