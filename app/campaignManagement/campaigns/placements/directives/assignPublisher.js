define(function (require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./assign-publisher.html');

	app.directive('assignPublisher', [function () {
		return {
			restrict: 'A',
			replace: true,
			scope: {
				publishers: '=',
				placement: '='
			},
			templateUrl: 'campaignManagement/campaigns/placements/directives/assign-publisher.html',
			controller: ['$scope', 'placementRecordService', 'campaignRecordService', 'accountRecordService',
					'divisionRecordService', 'clientRecordService', 'clientPublisherRecordService',
					function ($scope, placementRecordService, campaignRecordService,
					accountRecordService, divisionRecordService, clientRecordService, clientPublisherRecordService
			) {
				$scope.$watch('placement', function() {
					if ($scope.placement && $scope.placement.campaignId) {
						updatePublishers($scope.placement.campaignId);
					}
				});

				function updatePublishers(campaignId) {
					campaignRecordService.fetch(campaignId)
						.then(function(resp) {
							accountRecordService.fetch(resp.data.accountId)
								.then(function(resp) {
									divisionRecordService.fetch(resp.data.divisionId)
										.then(function(resp) {
											clientRecordService.fetch(resp.data.clientId)
												.then(function(resp) {
													clientPublisherRecordService.fetch(resp.data.id)
														.then(function(resp) {
															$scope.publishers = resp.data;
														});
												});
										});
								});
						});
				}
			}]
		};
	}]);
});
