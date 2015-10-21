define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./skip-countdown.html');

	app.directive('skipCountdown', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/skip-countdown.html',
			controller: [function () {
			}]
		};
	}]);
});
