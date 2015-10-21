define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./audio-off.html');

	app.directive('audioOff', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/audio-off.html',
			controller: [function () {
			}]
		};
	}]);
});
