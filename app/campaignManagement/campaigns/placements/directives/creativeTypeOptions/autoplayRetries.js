define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./autoplay-retries.html');

	app.directive('autoplayRetries', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/autoplay-retries.html',
			controller: ['$scope', function ($scope) {
				$scope.autoplayRetries = [
					{id: 1, name: '1x'},
					{id: 2, name: '2x'},
					{id: 3, name: '3x'},
					{id: 4, name: '4x'},
					{id: 5, name: '5x'}
				];
			}]
		};
	}]);
});
