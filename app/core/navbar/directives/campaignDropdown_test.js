define(function(require) {
	'use strict';

	require('./campaignDropdown');
	require('angularMocks');

	var template = require('tpl!./campaign.html');

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

	describe('campaignDropdownDirective', function() {
		var compile, rootScope, document, campaign, navbar, account;

		beforeEach(function() {
			module('app.core');

			module(function($provide) {
				var campaignId;
				var getCampaignName = function() {
					var campaignName;
					campaigns.forEach(function(campaign) {
						if(campaign.id === campaignId) {
							campaignName = campaign.name;
						}
					});
					return campaignName;
				};

				$provide.value('navbarService', {
					observe: function(callback) {
						callback();
					},
					all: function() {
						return {
							campaign: {
								name: getCampaignName()
							}
						};
					},
					setData: function(data) {
						campaignId = data.campaignId;
					}
				});
			});

			inject(function($compile, $rootScope, $document, $templateCache, navbarService, campaignService, accountService) {
				$templateCache.put('core/navbar/directives/campaign.html', template);

				compile = $compile;
				rootScope = $rootScope;
				document = $document;
				navbar = navbarService;
				campaign = campaignService;
				account = accountService;
			});
		});

		function createDropDown(campaigns) {
			campaign.setData(campaigns);
			account.setData([
				{
					'id': 'accountId0',
					'name': 'Account 0',
					'pinned': false,
					'active': false,
					'lastViewed': '2015-01-01T12:00:00Z',
					'lastViewedName': 'Joe Snoopypants',
					'client': {'id': 'clientId0'},
					'division': {'id': 'divisionId0'}
				},
				{
					'id': 'accountId1',
					'name': 'Account 1',
					'pinned': false,
					'active': false,
					'lastViewed': '2015-01-01T12:00:00Z',
					'lastViewedName': 'Jo Ma Ma',
					'client': {'id': 'clientId1'},
					'division': {'id': 'divisionId1'}
				}
			]);

			var parentScope = rootScope.$new();
			var html = compile('<div campaign-dropdown="test"></div>')(parentScope);
			parentScope.$apply();

			return html.scope();
		}

		describe('controller', function() {
			it('should check to see if elements are pinned.', function() {
				var scope = createDropDown(campaigns);

				expect(scope.pinned).toEqual([campaign.all()[0]]);
			});

			it('should check to see if the quarter map exists', function() {
				var scope = createDropDown(campaigns);

				expect(scope.quarterMap).toEqual(campaign.quarterMap());
			});

			it('should change the pinned campaign when pin state change', function() {
				var scope = createDropDown(campaigns);

				expect(scope.pin).toEqual(jasmine.any(Function));
				expect(scope.unpin).toEqual(jasmine.any(Function));

				spyOn(scope, 'unpin');
				spyOn(scope, 'pin');

				scope.unpin(campaign.all()[0]);
				expect(scope.unpin).toHaveBeenCalled();

				scope.pin(campaign.all()[0]);
				expect(scope.pin).toHaveBeenCalled();
			});

			it('should have the current campaign', function() {
				var scope = createDropDown(campaigns);

				expect(scope.current).toEqual('All Campaigns');
			});

			it('should update the query results on a search', function() {
				var scope = createDropDown(campaigns);

				scope.query = 'Campaign 0';
				scope.$digest();

				expect(scope.results).toEqual([campaign.all()[0]]);

				scope.query = 'Campaign 01';
				scope.$digest();

				expect(scope.results).toEqual([]);
			});

			it('should return the current campaign', function() {
				navbar.setData({campaignId: 'campaignId0'});

				var scope = createDropDown(campaigns);

				expect(scope.current).toEqual('Campaign 0');
			});

			it('should return the current campaign with account.', function() {
				navbar.setData({campaignId: 'campaignId0', accountId: 'accountId0'});

				var scope = createDropDown(campaigns);

				expect(scope.current).toEqual('Campaign 0');
			});

		});
	});
});
