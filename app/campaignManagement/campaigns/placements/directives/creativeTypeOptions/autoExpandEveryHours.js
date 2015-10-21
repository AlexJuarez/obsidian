define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./auto-expand-every-hours.html');

	app.directive('autoExpandEveryHours', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/auto-expand-every-hours.html',
			controller: [function () {
			}]
		};
	}]);
});
