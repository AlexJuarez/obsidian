define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./mute-on-roll-out.html');

	app.directive('muteOnRollOut', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/mute-on-roll-out.html',
			controller: [function () {
			}]
		};
	}]);
});
