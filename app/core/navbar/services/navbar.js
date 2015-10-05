/* jshint -W101 */

define(function(require) {
	'use strict';

	var module = require('./../../module');
	var ng = require('angular');

	module.service('navbarService', [
		'dataFactory', 'clientService', 'divisionService', 'accountService',
		'campaignService', '$rootScope', '$state',
		function(dataFactory, clients, divisions, accounts, campaigns, $rootScope, $state) {
			var navInfo = dataFactory();
			navInfo.setData($state.params);
			clients.observe(navInfo.notifyObservers);
			accounts.observe(navInfo.notifyObservers);
			divisions.observe(navInfo.notifyObservers);
			campaigns.observe(navInfo.notifyObservers);

			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
				navInfo.setData(toParams);
			});

			var oldState = all();
			navInfo.observe(function() {
				var currentState = all();

				if(! ng.equals(oldState, currentState)) {
					oldState = currentState;
					$rootScope.$broadcast('navStateChange', currentState);
				}
			});

			function getCampaign(campaignId) {

				var campaign = campaigns.get(campaignId);
				if(campaign) {
					return {
						campaign: {id: campaign.id, name: campaign.name},
						account: campaign.account,
						division: campaign.division,
						client: campaign.client
					};
				}

				// Grab the one campaign we need and set the data in campaigns
				dataFactory().init({
					endpoint: 'campaigns',
					queryParams: {
						dimensions: [
							'id', 'name','account.id', 'account.name', 'division.id', 'division.name',
							'client.id', 'client.name'
						],
						filters: [
							'id:eq:' + campaignId
						]
					}
				}, function(data) {

					// Transform to grab the one campaign
					return data.campaigns[0];
				}).then(function(campaign) {
					campaigns.addData([campaign]);
				});

				return {};
			}

			function all() {
				var data = navInfo.all() || {};

				if(data.campaignId) {
					return getCampaign(data.campaignId);
				}
				//if(data.accountId) {
				//	return getAccount(data.accountId);
				//}
				//if(data.divisionId) {
				//	return getDivision(data.divisionId);
				//}
				//if(data.clientId) {
				//	return getClient(data.clientId);
				//}
				return {};
			}

			return {
				setData: navInfo.setData,
				observe: navInfo.observe,
				all: all,
				params: navInfo.all
			};
		}
	]);
});
