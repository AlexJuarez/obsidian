define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./collapse-on-roll-out.html');

	app.directive('collapseOnRollOut', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/collapse-on-roll-out.html',
			controller: [function () {
			}]
		};
	}]);
});
