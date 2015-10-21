define(function (require) {
	'use strict';

	var app = require('./../../../../module');

	require('tpl!./vast-media-file-type.html');

	app.directive('vastMediaFileType', [function () {
		return {
			restrict: 'C',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/creativeTypeOptions/vast-media-file-type.html',
			controller: [function () {
			}]
		};
	}]);
});
