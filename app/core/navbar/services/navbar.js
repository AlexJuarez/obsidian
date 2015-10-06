/* jshint -W101 */

define(function(require) {
	'use strict';

	var module = require('./../../module');
	var ng = require('angular');

	module.service('navbarService', [
		'dataFactory', 'clientService', 'divisionService', 'accountService',
		'campaignService', '$rootScope', '$state',
		function(dataFactory, clients, divisions, accounts, campaigns, $rootScope, $state) {

			var cache = {
				campaigns: {},
				accounts: {},
				divisions: {},
				clients: {}
			};

			var navInfo = dataFactory();
			navInfo.setData($state.params);
			clients.observe(navInfo.notifyObservers);
			accounts.observe(navInfo.notifyObservers);
			divisions.observe(navInfo.notifyObservers);
			campaigns.observe(navInfo.notifyObservers);

			var dimensionTypes = {
				campaigns: [
					'id', 'name', 'account.id', 'account.name', 'division.id', 'division.name',
					'client.id', 'client.name'
				],
				accounts: [ 'id', 'name', 'division.id', 'division.name', 'client.id', 'client.name' ],
				divisions: [ 'id', 'name', 'client.id', 'client.name' ],
				clients: [ 'id', 'name' ]
			};

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

			function getRecord(id, type) {
				var record = getExistingRecord(id, type);
				if(record) {
					return transformRecord(record, type);
				}
				if (!cache[type][id]) {

					// Grab the one campaign we need and set the data in campaigns
					var options = {
						endpoint: type,
						queryParams: {
							dimensions: ng.copy(dimensionTypes[type]),
							filters: [
								'id:eq:' + id
							]
						}
					};

					cache[type][id] = dataFactory().init(options, function(data) {
						// Transform to grab the one record
						return data[type][0];
					}).then(function(record) {
						addRecord(record, type);
					});
				}
				return {};
			}

			function getExistingRecord(id, type) {
				switch(type) {
					case 'campaigns':
						return campaigns.get(id);
					case 'accounts':
						return accounts.get(id);
					case 'divisions':
						return divisions.get(id);
					case 'clients':
						return clients.get(id);
				}
			}

			function addRecord(record, type) {
				switch(type) {
					case 'campaigns':
						campaigns.addData([record]);
						break;
					case 'accounts':
						accounts.addData([record]);
						break;
					case 'divisions':
						divisions.addData([record]);
						break;
					case 'clients':
						clients.addData([record]);
						break;
				}
			}

			function transformRecord(record, type) {
				switch(type) {
					case 'campaigns':
						return {
							campaign: {id: record.id, name: record.name},
							account: record.account,
							division: record.division,
							client: record.client
						};
					case 'accounts':
						return {
							account: {id: record.id, name: record.name},
							division: record.division,
							client: record.client
						};
					case 'divisions':
						return {
							division: {id: record.id, name: record.name},
							client: record.client
						};
					case 'clients':
						return {
							client: {id: record.id, name: record.name}
						};
				}
			}

			function all() {
				var data = navInfo.all() || {};

				if(data.campaignId) {
					return getRecord(data.campaignId, 'campaigns');
				}
				if(data.accountId) {
					return getRecord(data.accountId, 'accounts');
				}
				if(data.divisionId) {
					return getRecord(data.divisionId, 'divisions');
				}
				if(data.clientId) {
					return getRecord(data.clientId, 'clients');
				}
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
