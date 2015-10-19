define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./play-mode.html');

	app.directive('playMode', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/play-mode.html',
			controller: [function () {
			}]
		};
	}]);
});
