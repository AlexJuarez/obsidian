define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./auto-collapse-after-seconds.html');

	app.directive('autoCollapseAfterSeconds', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/auto-collapse-after-seconds.html',
			controller: [function () {
			}]
		};
	}]);
});
