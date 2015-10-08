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
				var creativeTypes = ENUMS.down.creativeTypes;

				creativeService.observe(updateCreativesByAdType, $scope);

				function updateCreativesByAdType() {
					var adTypes = {};
					var creatives = creativeService.data().all();

					creatives.forEach(function(creative) {
						if(! adTypes[creative.type]) {
							adTypes[creative.type] = [];
						}

						adTypes[creative.type].push(creative);
					});

					$scope.creativesByAdType = adTypes;
				}

				$scope.$watch('creative', function() {
					$scope.isExpanding = false;
					if ($scope.creative) {
						$scope.creativeType = creativeTypes[$scope.creative.type];
						if ($scope.creative.expandedWidth) {
							$scope.isExpanding = true;
						}
					}
				});
			}]
		};
	}]);
});
