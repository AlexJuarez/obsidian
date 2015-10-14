define(function(require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./expand-anchors-directions.html');

	app.directive('expandAnchorsDirections', [
		function() {
			return {
				restrict: 'A',
				replace: true,
				scope: false,
				templateUrl: 'campaignManagement/campaigns/placements/directives/expand-anchors-directions.html',
				controller: [
					'$scope', function($scope) {
						var imageDirectory = '/images/anchorsExpandDirections/';
						$scope.expandAnchors = [];
						$scope.expandDirections = [
							{id: 'left', name: 'Expand to Left'},
							{id: 'right', name: 'Expand to Right'},
							{id: 'up', name: 'Expand Upwards'},
							{id: 'down', name: 'Expand Downwards'}
						];
						$scope.placement.expandDirection = 'left';

						var commonAnchors = [
							'bottomright',
							'topright',
							'bottomleft',
							'topleft'
						];

						var expandAnchorPossibilities = {
							left: ['left', 'right'].concat(commonAnchors),
							right: ['left', 'right'].concat(commonAnchors),
							up: ['top', 'bottom'].concat(commonAnchors),
							down: ['top', 'bottom'].concat(commonAnchors)
						};

						$scope.$watch('placement.expandDirection', function() {
							if(typeof $scope.placement.expandDirection === 'string') {
								$scope.expandAnchors = [];
								var expandAnchors = expandAnchorPossibilities[$scope.placement.expandDirection];
								expandAnchors.forEach(function(anchor) {
									$scope.expandAnchors.push({
										image: imageDirectory + $scope.placement.expandDirection + '_' + anchor + '.svg',
										value: anchor
									});
								});

								$scope.placement.expandAnchor = $scope.expandAnchors[0].value;
							}
						});

						$scope.setExpandAnchor = function(anchor) {
							$scope.placement.expandAnchor = anchor;
						};
					}
				]
			};
		}
	]);
});
