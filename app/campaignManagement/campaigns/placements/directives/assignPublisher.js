define(function(require) {
	'use strict';

	var app = require('./../../../module');

	require('tpl!./assign-publisher.html');

	app.directive('assignPublisher', [
		function() {
			return {
				restrict: 'A',
				replace: true,
				scope: false,
				templateUrl: 'campaignManagement/campaigns/placements/directives/assign-publisher.html',
				controller: [
					'$scope', 'navbarService', 'clientPublisherRecordService',
					function($scope, navbar, clientPublisherRecordService) {
						updatePublishers();
						navbar.observe(function() {
							updatePublishers();
						});

						function updatePublishers() {
							var navbarData = navbar.all();
							if(navbarData && navbarData.client && navbarData.client.id) {
								clientPublisherRecordService.fetch(navbarData.client.id)
									.then(function(resp) {
										$scope.publishers = resp.data;
									});
							}
						}
					}
				]
			};
		}
	]);
});
