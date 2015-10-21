define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./lightbox-opacity.html');

	app.directive('lightboxOpacity', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/lightbox-opacity.html',
			controller: [function () {
			}]
		};
	}]);
});
