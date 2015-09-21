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

        var firstCampaignArchivedQ4 = {
            'id': 'campaignId0',
            'name': 'Campaign 0',
            'pinned': false,
            'status': 'archived',
            'goalImpressions': 100,
            'lastViewed': '2015-01-01T12:00:00Z',
            'lastViewedName': 'Anne Smith',
            'startDate': '2015-10-20',
            'endDate': '2015-11-20',
            'client': 'clientId1',
            'division': 'divisionId1',
            'account': 'accountId1',
            'metrics': {
                'currentImpressions': 15,
                'placementCount': 1,
                'creativeCount': 1
            }
        };

        var secondCampaignCompletedQ3 = {
            'id': 'campaignId1',
            'name': 'Campaign 1',
            'pinned': false,
            'status': 'completed',
            'goalImpressions': 100,
            'lastViewed': '2015-01-01T12:00:00Z',
            'lastViewedName': 'Anne Smith',
            'startDate': '2015-07-20',
            'endDate': '2015-08-20',
            'client': 'clientId1',
            'division': {'id': 'divisionId1'},
            'account': {'id': 'accountId1'},
            'metrics': {
                'currentImpressions': 15,
                'placementCount': 1,
                'creativeCount': 1
            }
        };

        var thirdCampaignInFlightQ2 = {
            'id': 'campaignId2',
            'name': 'Campaign 2',
            'pinned': false,
            'status': 'inFlight',
            'goalImpressions': 100,
            'lastViewed': '2015-01-01T12:00:00Z',
            'lastViewedName': 'Anne Smith',
            'startDate': '2015-04-20',
            'endDate': '2015-05-20',
            'client': 'clientId1',
            'division': {'id': 'divisionId1'},
            'account': {'id': 'accountId1'},
            'metrics': {
                'currentImpressions': 15,
                'placementCount': 1,
                'creativeCount': 1
            }
        };

        var fourthCampaignPreFlightQ1 = {
            'id': 'campaignId3',
            'name': 'Campaign 3',
            'pinned': false,
            'status': 'preFlight',
            'goalImpressions': 1000000,
            'lastViewed': '2015-01-01T12:00:00Z',
            'lastViewedName': 'Joe Snoopypants',
            'startDate': '2015-01-20',
            'endDate': '2015-02-20',
            'client': 'clientId0',
            'division': {'id': 'divisionId0'},
            'account': {'id': 'accountId0'},
            'metrics': {
                'currentImpressions': 15000,
                'placementCount': 10,
                'creativeCount': 10
            }
        };


        var fifthCampaignPreFlightQ1 = {
            'id': 'campaignId4',
            'name': 'Campaign 4',
            'pinned': false,
            'status': 'preFlight',
            'goalImpressions': 1000000,
            'lastViewed': '2015-01-01T12:00:00Z',
            'lastViewedName': 'Joe Snoopypants',
            'startDate': '2015-01-10',
            'endDate': '2015-02-20',
            'client': 'clientId0',
            'division': {'id': 'divisionId0'},
            'account': {'id': 'accountId0'},
            'metrics': {
                'currentImpressions': 15000,
                'placementCount': 10,
                'creativeCount': 10
            }
        };

        var campaignsUnsorted = [
            firstCampaignArchivedQ4,
            secondCampaignCompletedQ3,
            fourthCampaignPreFlightQ1,
            thirdCampaignInFlightQ2,
            fifthCampaignPreFlightQ1
        ];

        var campaignsSorted = [
            firstCampaignArchivedQ4,
            secondCampaignCompletedQ3,
            thirdCampaignInFlightQ2,
            fourthCampaignPreFlightQ1,
            fifthCampaignPreFlightQ1
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
                    'campaigns': campaignsSorted
                });

            campaign.init(apiConfig).then(function () {
                expect(campaign.all()).toEqual(campaignsSorted);
            });
            httpBackend.flush();
        });

        it('should order campaigns by start date descending', function () {
            campaign.setData(campaignsUnsorted);
            var a = campaign.all()[0];
            var b = campaign.all()[1];
            var c = campaign.all()[2];
            var d = campaign.all()[3];
            var e = campaign.all()[4];
            expect(a.id).toEqual(firstCampaignArchivedQ4.id);
            expect(b.id).toEqual(secondCampaignCompletedQ3.id);
            expect(c.id).toEqual(thirdCampaignInFlightQ2.id);
            expect(d.id).toEqual(fourthCampaignPreFlightQ1.id);
            expect(e.id).toEqual(fifthCampaignPreFlightQ1.id);
        });

        it('should pin an campaign', function () {
            campaign.setData(campaignsUnsorted);
            var a = campaign.all()[0];
            campaign.pin(a);
            expect(campaign.pinned().length).toEqual(1);
        });

        it('should unpin an campaign', function () {
            campaign.setData(campaignsUnsorted);
            var a = campaign.all()[0];
            campaign.pin(a);
            campaign.unpin(a);
            expect(campaign.pinned().length).toEqual(0);
        });

        it('should return a map containing a key of correct quarter information', function () {
            campaign.setData(campaignsUnsorted);
            expect(campaign.quarterMap()).toEqual(
                [
                    {key: '2015 Q4', value: [firstCampaignArchivedQ4]},
                    {key: '2015 Q3', value: [secondCampaignCompletedQ3]},
                    {key: '2015 Q2', value: [thirdCampaignInFlightQ2]},
                    {key: '2015 Q1', value: [fourthCampaignPreFlightQ1, fifthCampaignPreFlightQ1]}
                ]);
        });

        it('should get an campaign by id', function () {
            campaign.setData(campaignsUnsorted);
            expect(campaign.get('campaignId0')).toEqual(firstCampaignArchivedQ4);
        });

        it('should get all campaigns in flight', function () {
            campaign.setData(campaignsUnsorted);
            expect(campaign.inFlight()).toEqual([thirdCampaignInFlightQ2]);
        });

        it('should get all campaigns pre flight', function () {
            campaign.setData(campaignsUnsorted);
            expect(campaign.preFlight()).toEqual([fourthCampaignPreFlightQ1, fifthCampaignPreFlightQ1]);
        });

        it('should get all campaigns that are completed', function () {
            campaign.setData(campaignsUnsorted);
            expect(campaign.completed()).toEqual([secondCampaignCompletedQ3]);
        });

        it('should return all from filter', function () {
            campaign.setData(campaignsUnsorted);
            state.params.accountId = '';
            expect(campaign.filtered()).toBeDefined();
            expect(campaign.all()).toEqual(campaign.filtered());
        });

        it('should filter by accountId', function () {
            campaign.setData(campaignsUnsorted);
            state.params.accountId = 'accountId0';
            expect(campaign.filtered()[0]).toBeDefined();
            expect(campaign.filtered()[1]).toBeDefined();
            expect(campaign.filtered()[0]).toEqual(fourthCampaignPreFlightQ1);
            expect(campaign.filtered()[1]).toEqual(fifthCampaignPreFlightQ1);
        });

        it('should filter by campaignId', function () {
            campaign.setData(campaignsUnsorted);

            state.params.accountId = '';
            state.params.campaignId = 'campaignId0';
            expect(campaign.filtered()[0]).toBeDefined();
            expect(campaign.filtered()[0]).toEqual(firstCampaignArchivedQ4);
        });

        it('should find our result by name', function () {
            campaign.setData(campaignsUnsorted);

            expect(campaign.search('ign 0')[0].id).toEqual('campaignId0');
        });
    });
});
