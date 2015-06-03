define(function (require) {
    'use strict';

    require('./campaign');
    require('angularMocks');

    describe('campaignService', function () {
        var campaign, httpBackend;

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
            inject(function (campaignService, $httpBackend) {
                campaign = campaignService;
                httpBackend = $httpBackend;
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
            httpBackend.when('GET', '/test')
                .respond({
                    'campaigns': campaigns
                });

            campaign.init('/test').then(function () {
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

        it('should make a request to search', function () {
            campaign.setData(campaigns);
            httpBackend.when('GET', '/narwhal/campaigns/search?q=test&limit=5').respond(
                []
            );
            expect(campaign.search('test')).toEqual([]);
            httpBackend.flush();
        });
    });
});
