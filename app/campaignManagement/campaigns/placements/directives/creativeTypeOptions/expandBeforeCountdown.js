define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./expand-before-countdown.html');

	app.directive('expandBeforeCountdown', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/expand-before-countdown.html',
			controller: [function () {
			}]
		};
	}]);
});
