define(function(require) {
	'use strict';

	require('./navbar');
	require('angularMocks');

	describe('navbarService', function() {
		var navbar, state, client, division, account, campaign, scope, httpBackend, apiGenerator;

		var clients = [
			{
				'id': 'clientId0',
				'name': 'Client 0',
				'pinned': true,
				'active': false,
				'lastViewed': '2015-01-01T12:00:00Z',
				'lastViewedName': 'Joe Snoopypants',
				'channel': 'Advertisers'
			}
		];

		var campaigns = [
			{
				'id': 'campaignId0',
				'name': 'Campaign 0',
				'pinned': true,
				'status': 'preFlight',
				'goalImpressions': 1000000,
				'lastViewed': '2015-01-01T12:00:00Z',
				'lastViewedName': 'Joe Snoopypants',
				'startDate': '2015-02-01',
				'endDate': '2015-03-01',
				'client': {id: 'clientId0'},
				'division': {id: 'divisionId0'},
				'account': {id: 'accountId0'},
				'metrics': {
					'currentImpressions': 15000,
					'placementCount': 10,
					'creativeCount': 10
				}
			}
		];

		var accounts = [
			{
				'id': 'accountId0',
				'name': 'Account 0',
				'pinned': false,
				'active': false,
				'lastViewed': '2015-01-01T12:00:00Z',
				'lastViewedName': 'Joe Snoopypants',
				'client': {'id': 'clientId0'},
				'division': {'id': 'divisionId0'}
			}
		];

		var divisions = [
			{
				'id': 'divisionId0',
				'name': 'Division 0',
				'pinned': true,
				'active': false,
				'lastViewed': '2015-01-01T12:00:00Z',
				'client': {'id': 'clientId0'}
			}
		];

		beforeEach(function() {
			module('app.core');

			inject(function(navbarService, $state, $rootScope, clientService, divisionService, accountService, campaignService, $httpBackend, apiUriGenerator) {
				navbar = navbarService;
				state = $state;
				client = clientService;
				division = divisionService;
				account = accountService;
				campaign = campaignService;
				client.setData(clients);
				division.setData(divisions);
				account.setData(accounts);
				campaign.setData(campaigns);
				scope = $rootScope;
				httpBackend = $httpBackend;
				apiGenerator = apiUriGenerator;
			});
		});

		afterEach(function () {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		});

		it('should be an instance of navbarService', function() {
			expect(navbar).not.toEqual(null);
		});

		describe('all function, per state', function() {
			it('should be empty without params', function() {
				expect(navbar.all()).toEqual({});
			});

			it('should return the client', function() {
				var params = {clientId: 'clientId0'};

				navbar.setData(params);

				expect(navbar.params()).toEqual(params);
				expect(navbar.all()).toEqual({client: clients[0]});
			});

			it('should return the division', function() {
				var params = {divisionId: 'divisionId0'};

				navbar.setData(params);

				expect(navbar.params()).toEqual(params);
				expect(navbar.all()).toEqual({
					client: clients[0],
					division: divisions[0]
				});
			});

			it('should return the account', function() {
				var params = {accountId: 'accountId0'};

				navbar.setData(params);

				expect(navbar.params()).toEqual(params);
				expect(navbar.all()).toEqual({
					client: clients[0],
					division: divisions[0],
					account: accounts[0]
				});
			});

			it('should return the campaign', function() {
				var params = {campaignId: 'campaignId0'};

				navbar.setData(params);

				expect(navbar.params()).toEqual(params);
				expect(navbar.all()).toEqual({
					client: clients[0],
					division: divisions[0],
					account: accounts[0],
					campaign: campaigns[0]
				});
			});

			it('should return {} for an client that does not exist', function() {

				httpBackend.when('GET', apiGenerator(navbar._getOptions('clients', 'clientId'))).respond({clients: [{ id: 1 }]});
				var params = {clientId: 'clientId'};

				navbar.setData(params);

				expect(navbar.all()).toEqual({});
				httpBackend.flush();
			});

			it('should return {} for an division that does not exist', function() {
				httpBackend.when('GET', apiGenerator(navbar._getOptions('divisions', 'divisionId'))).respond({divisions: [{ id: 1 }]});
				var params = {divisionId: 'divisionId'};

				navbar.setData(params);

				expect(navbar.all()).toEqual({});
				httpBackend.flush();
			});

			it('should return {} for an account that does not exist', function() {
				httpBackend.when('GET', apiGenerator(navbar._getOptions('accounts', 'accountId'))).respond({accounts: [{ id: 1 }]});
				var params = {accountId: 'accountId'};

				navbar.setData(params);

				expect(navbar.all()).toEqual({});
				httpBackend.flush();
			});

			it('should return {} for an account that does not exist', function() {
				httpBackend.when('GET', apiGenerator(navbar._getOptions('campaigns', 'campaignId'))).respond({campaigns: [{ id: 1 }]});
				var params = {campaignId: 'campaignId'};

				navbar.setData(params);

				expect(navbar.all()).toEqual({});
				httpBackend.flush();
			});
		});

		it('should change the params when the rootScope changes', function() {
			httpBackend.when('GET', apiGenerator(navbar._getOptions('clients', 'testId'))).respond({clients: [{ id: 1 }]});
			var params = {clientId: 'testId'};

			scope.$broadcast('$stateChangeSuccess', {}, params);

			expect(navbar.params()).toEqual(params);
			httpBackend.flush();
		});

		it('should not chock if params are undefined', function() {

			scope.$broadcast('$stateChangeSuccess', {});

			expect(navbar.all()).toEqual({});
		});
	});
});
