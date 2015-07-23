define(function (require) {
    'use strict';

    require('./campaign');
    require('angularMocks');

    describe('campaignService', function () {
        var campaign, httpBackend, state, accountServ, apiGenerator;

        var apiConfig = {
            endpoint: 'test',
            dimensions: 'one'
        };

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
                'client': 'clientId0',
                'division': 'divisionId0',
                'account': 'accountId0',
                'metrics': {
                    'currentImpressions': 15000,
                    'placementCount': 10,
                    'creativeCount': 10
                }
            }
        ];

        beforeEach(function () {
            module('app.core');
            inject(function (campaignService, $httpBackend, $state, accountService, apiUriGenerator) {
                campaign = campaignService;
                accountServ = accountService;
                httpBackend = $httpBackend;
                state = $state;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of campaignService', function () {
            expect(campaign).not.toEqual(null);
        });

        it('should make a request on init', function () {
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond({
                    'campaigns': campaigns
                });

            campaign.init(apiConfig).then(function () {
                expect(campaign.all()).toEqual(campaigns);
            });
            httpBackend.flush();
        });

        it('should pin an campaign', function () {
            campaign.setData(campaigns);
            var a = campaign.all()[0];
            campaign.pin(a);
            expect(campaign.pinned().length).toEqual(1);
        });

        it('should unpin an campaign', function () {
            campaign.setData(campaigns);
            var a = campaign.all()[0];
            campaign.pin(a);
            campaign.unpin(a);
            expect(campaign.pinned().length).toEqual(0);
        });

        it('should return a map containing a key of correct quarter information', function () {
            campaign.setData(campaigns);
            expect(campaign.quarterMap()).toEqual([{key: '2015 Q1', value: [campaigns[0]]}]);
        });

        it('should get an campaign by id', function () {
            campaign.setData(campaigns);
            expect(campaign.get('campaignId0')).toEqual(campaigns[0]);
        });

        it('should get all campaigns in flight', function () {
            campaign.setData(campaigns);
            expect(campaign.inFlight()).toEqual([]);
        });

        it('should get all campaigns pre flight', function () {
            campaign.setData(campaigns);
            expect(campaign.preFlight()).toEqual([campaigns[0]]);
        });

        it('should get all campaigns that are completed', function () {
            campaign.setData(campaigns);
            expect(campaign.completed()).toEqual([]);
        });

        it('should correctly fallback and populate output in filtered()', function () {
            campaign.setData(campaigns);
            accountServ.filtered = function(){
                return [
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
            };
            state.params.accountId = '';
            state.params.divisionId = 'divisionId0';
            expect(campaign.filtered()[0]).toEqual(campaign.get('accountId0'));
        });

        it('should return all with matching accountId', function () {
            campaign.setData(campaigns);
            state.params.accountId = 'accountId0';
            expect(campaign.filtered()[0]).toEqual(campaign.get('accountId0'));
        });

        it('should return all from filter', function () {
            campaign.setData(campaigns);
            state.params.accountId = '';
            expect(campaign.all()).toEqual(campaign.filtered());
        });

        it('should find our result by name', function () {
            campaign.setData(campaigns);

            expect(campaign.search('ign 0')[0].id).toEqual('campaignId0');
        });
    });
});
