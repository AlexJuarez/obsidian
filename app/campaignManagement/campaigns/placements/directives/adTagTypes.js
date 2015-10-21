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

				var adTagServiceReady = false;
				adTagService.init();
				adTagService.observe(function() {
					adTagServiceReady = true;
				});

				$scope.$watch('creativeType', function() {
					if (adTagServiceReady) {
						if($scope.creativeType === 'inStream') {
							$scope.tagTemplates = adTagService.inStream();
						} else {
							$scope.tagTemplates = adTagService.regular();
						}
					}
				});

				$scope.$watch('placement.adTagId', function() {
					var adTagInfo = adTags.getInfo($scope.placement.adTagId);

					updateAdTagText();
					$scope.needsVastMediaFileType = adTagInfo.needsVastMediaFileType;
					$scope.needsVastMimeType = adTagInfo.needsVastMimeType;
				});

				$scope.$watch('placement.vastMimeType', function () {
					updateAdTagText();
				});

				function updateAdTagText() {
					$scope.adTagText = adTags.pullTag($scope.placement);
				}
			}]
		};
	}]);
});
