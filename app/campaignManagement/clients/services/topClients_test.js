define(function (require) {
    'use strict';

    require('./topClients');
    require('angularMocks');

    describe('topClients', function () {
        var topClients, httpBackend;
        var clients = [{
            "metrics": {
                "impressions": 50,
                "countAccountsActive": 3242,
                "countCampaignsPreFlight": 123,
                "countCampaignsInFlight": 1234
            }, "id": "clientId0", "name": "Client 0", "channel": "Advertisers"
        }, {
            "metrics": {
                "impressions": 100,
                "countAccountsActive": 3242,
                "countCampaignsPreFlight": 623,
                "countCampaignsInFlight": 53
            }, "id": "clientId1", "name": "Client 1", "channel": "Advertisers"
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
            httpBackend.when('GET', '/test')
                .respond({clients: []});

            topClients.init('/test').then(function () {
                expect(topClients.data()).toEqual([]);
            });
            httpBackend.flush();
        });

        it('should sort on impressions', function () {
            httpBackend.when('GET', '/test')
                .respond({clients: clients});

            topClients.init('/test');

            httpBackend.flush();

            expect(topClients.data()[0].impressions).toEqual(100);
        });

        it('should return an object describing the table', function () {
            httpBackend.when('GET', '/test')
                .respond({clients: []});

            topClients.init('/test');

            expect(topClients.all().rules).toBeDefined();
            expect(topClients.all().headers).toBeDefined();
            expect(topClients.all().data).toBeDefined();

            httpBackend.flush();
        })

    });
});
