define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./vast-mime-type.html');

	app.directive('vastMimeType', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/vast-mime-type.html',
			controller: [function () {
			}]
		};
	}]);
});
