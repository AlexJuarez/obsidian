define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./expand-type.html');

	app.directive('expandType', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/expand-type.html',
			controller: [function () {
			}]
		};
	}]);
});
