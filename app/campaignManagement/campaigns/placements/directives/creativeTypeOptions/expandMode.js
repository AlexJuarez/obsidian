define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./expand-mode.html');

	app.directive('expandMode', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/expand-mode.html',
			controller: [function () {
			}]
		};
	}]);
});
