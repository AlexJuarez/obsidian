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

			function getOptions(type, id) {
				return {
					endpoint: type,
					queryParams: {
						dimensions: ng.copy(dimensionTypes[type]),
						filters: [
							'id:eq:' + id
						]
					}
				};
			}

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

				// If the navbar services already have all the data we need, just return
				// that data
				var record = getExistingRecord(id, type);
				if(!ng.equals(record, {})) {
					return record;
				}

				// If we've already made the request for the data we need, return that
				// data
				var cachedRecord = cache[type][id];
				if (cachedRecord) {
					record = cachedRecord.all();
					if (!ng.equals(record, [])) {
						return transformRecord(record[0], type);
					}
				} else {

					// Grab the one record we need and notifyObservers when done, so
					// they'll re-query all()
					var options = getOptions(type, id);

					var transformResponse = function(data) {
						return data[type];
					};

					cache[type][id] = dataFactory();
					cache[type][id].init(options, transformResponse).then(navInfo.notifyObservers);
				}

				return {};
			}

			function getExistingRecord(id, type) {
				switch(type) {
					case 'campaigns':
						return getCampaign(id);
					case 'accounts':
						return getAccount(id);
					case 'divisions':
						return getDivision(id);
					case 'clients':
						return getClient(id);
				}
			}

			function getClient(id) {
				var data = {};
				var client = clients.get(id);

				if (client) {
					data.client = client;
				}

				return data;
			}

			function getDivision(id) {
				var data = {};
				var division = divisions.get(id);

				if (division) {
					data.division = division;
					var client = clients.get(division.client.id);
					if (client) {
						data.client = client;
					}
				}

				return data;
			}

			function getAccount(id) {
				var data = {};
				var account = accounts.get(id);

				if (account) {
					data.account = account;
					var division = divisions.get(account.division.id);

					if (division) {
						data.division = division;
						var client = clients.get(division.client.id);

						if (client) {
							data.client = client;
						}
					}
				}

				return data;
			}

			function getCampaign(id) {
				var data = {};
				var campaign = campaigns.get(id);

				if (campaign) {
					data.campaign = campaign;
					var account = accounts.get(campaign.account.id);

					if (account) {
						data.account = account;
						var division = divisions.get(account.division.id);

						if (division) {
							data.division = division;

							var client = clients.get(division.client.id);
							if (client) {
								data.client = client;
							}
						}
					}
				}

				return data;
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
				params: navInfo.all,
				_getOptions: getOptions
			};
		}
	]);
});
