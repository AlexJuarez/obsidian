define(function (require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./assign-creative.html');

	app.directive('assignCreative', [function () {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				placement: '='
			},
			templateUrl: 'campaignManagement/campaigns/placements/directives/assign-creative.html',
			controller: ['$scope', 'creatives', function ($scope, creativeService) {

				creativeService.observe(setupPickCreative, $scope);

				function setupPickCreative() {
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
			}]
		};
	}]);
});
