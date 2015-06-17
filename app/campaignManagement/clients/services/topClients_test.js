define(function (require) {
    'use strict';

    require('./topClients');
    require('angularMocks');

    describe('topClients', function () {
        var topClients, httpBackend;
        var clients = [{
            'metrics': {
                'impressions': 50,
                'countAccountsActive': 3242,
                'countCampaignsPreFlight': 123,
                'countCampaignsInFlight': 1234
            }, 'id': 'clientId0', 'name': 'Client 0', 'channel': 'Advertisers'
        }, {
            'metrics': {
                'impressions': 100,
                'countAccountsActive': 3242,
                'countCampaignsPreFlight': 623,
                'countCampaignsInFlight': 53
            }, 'id': 'clientId1', 'name': 'Client 1', 'channel': 'Advertisers'
        }];

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (topClientsService, $httpBackend) {
                topClients = topClientsService;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of topClients', function () {
            expect(topClients).not.toEqual(null);
        });

        it('should make a request to init', function () {
            httpBackend.when('GET', '/api/v3/clients?dimensions=id,name,channel,lastViewedUserDate,lastViewedUserName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions:desc&limit=10')
                .respond({clients: []});

            topClients.init().then(function () {
                expect(topClients.data()).toEqual([]);
            });
            httpBackend.flush();
        });

        it('should sort on impressions', function () {
            httpBackend.when('GET', '/api/v3/clients?dimensions=id,name,channel,lastViewedUserDate,lastViewedUserName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions:desc&limit=10')
                .respond({clients: clients});

            topClients.init();

            httpBackend.flush();

            expect(topClients.data()[0].impressions).toEqual(100);
        });

        it('should return an object describing the table', function () {
            httpBackend.when('GET', '/api/v3/clients?dimensions=id,name,channel,lastViewedUserDate,lastViewedUserName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions:desc&limit=10')
                .respond({clients: []});

            topClients.init();

            expect(topClients.all().rules).toBeDefined();
            expect(topClients.all().headers).toBeDefined();
            expect(topClients.all().data).toBeDefined();

            httpBackend.flush();
        });

    });
});
