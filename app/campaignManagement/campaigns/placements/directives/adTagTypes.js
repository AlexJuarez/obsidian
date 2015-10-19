define(function (require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./ad-tag-types.html');

	app.directive('adTagTypes', [function () {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			templateUrl: 'campaignManagement/campaigns/placements/directives/ad-tag-types.html',
			controller: ['$scope', 'adTagService', 'adTags', function ($scope, adTagService, adTags) {
				$scope.tagTemplates = [];

				adTagService.init();
				adTagService.observe(function() {
					$scope.tagTemplates = adTagService.all();
				});

				$scope.$watch('placement.adTagId', function() {
					$scope.adTagText = adTags.pullTag($scope.placement);
				});
			}]
		};
	}]);
});
