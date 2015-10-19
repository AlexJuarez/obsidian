define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./audio-on-rollover.html');

	app.directive('audioOnRollover', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/audio-on-rollover.html',
			controller: [function () {
			}]
		};
	}]);
});
