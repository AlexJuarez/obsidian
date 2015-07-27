define(function (require) {
    'use strict';

    require('./topClients');
    require('angularMocks');

    describe('topClients', function () {
        var topClients, httpBackend, apiGenerator;
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
            module('app.core');
            inject(function (topClientsService, $httpBackend, apiUriGenerator) {
                topClients = topClientsService;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
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
            httpBackend.when('GET', apiGenerator(topClients._apiConfig))
                .respond({clients: []});

            topClients.init().then(function () {
                expect(topClients.data()).toEqual([]);
            });
            httpBackend.flush();
        });

        it('should sort on impressions', function () {
            httpBackend.when('GET', apiGenerator(topClients._apiConfig))
                .respond({clients: clients});

            topClients.init();

            httpBackend.flush();

            expect(topClients.data()[0].impressions).toEqual(100);
        });

        it('should return an object describing the table', function () {
            httpBackend.when('GET', apiGenerator(topClients._apiConfig))
                .respond({clients: []});

            topClients.init();

            expect(topClients.all().rules).toBeDefined();
            expect(topClients.all().headers).toBeDefined();
            expect(topClients.all().data).toBeDefined();

            httpBackend.flush();
        });

    });
});
