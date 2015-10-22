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
					'$scope', 'navbarService', 'clientPublisherRecordService', '$http',
					function($scope, navbar, clientPublisherRecordService, $http) {
						updatePublishers();
						navbar.observe(function() {
							updatePublishers();
						});

						function updatePublishers() {
							var navbarData = navbar.all();
							if(navbarData && navbarData.client && navbarData.client.id) {
								clientPublisherRecordService.fetch(navbarData.client.id)
									.then(function(resp) {
										if (resp.data[0]) {
											$scope.publishers = resp.data;
										} else {

											// TEMPORARILY JUST GRAB A RANDOM PUBLISHER ID. REMOVE FOR RELEASE
											$http.get('/api/crud/publishers?limit=1').success(function(data) {
												var publisher = data[0];
												publisher.name = 'Default Publisher';
												$scope.publishers = [publisher];
											});
										}
									});
							}
						}
					}
				]
			};
		}
	]);
});
