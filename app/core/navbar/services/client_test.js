define(function (require) {
    'use strict';

    require('./client');
    require('angularMocks');

    var ng = require('angular');

    describe('clientService', function () {
        var client, httpBackend, apiGenerator;

        var apiConfig = {
            endpoint: 'test',
            dimensions: ['one']
        };

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

        beforeEach(function () {
            module('app.core');
            inject(function (clientService, $httpBackend, apiUriGenerator) {
                client = clientService;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of clientService', function () {
            expect(client).not.toEqual(null);
        });

        it('should make a request on init', function () {
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond({
                    'clients': clients
                });

            client.init(apiConfig).then(function () {
                expect(client.all()).toEqual(clients);
            });
            httpBackend.flush();
        });

        it('should pin a client', function () {
            var pinConfig = ng.copy(client._apiPinConfig);
            pinConfig.endpoint += clients[0].id;
            client.setData(clients);
            var firstClient = client.all()[0];
            httpBackend.expect('GET', apiGenerator(pinConfig))
                .respond( 200, { id: clients[0].id, pinned: false } );

            httpBackend.expect('PUT', apiGenerator(pinConfig))
                .respond( 200, { pinned: true } );
            client.pin(firstClient);
            expect(client.pinned().length).toEqual(1);
            httpBackend.flush();
        });

        it('should unpin a client', function () {
            var pinConfig = ng.extend({}, client._apiPinConfig);
            pinConfig.endpoint += clients[0].id;

            httpBackend.expect('GET', apiGenerator(pinConfig))
                .respond( 200, clients[0] );

            httpBackend.expect('PUT', apiGenerator(pinConfig))
                .respond( 200, { id: clients[0].id, pinned: false } );

            client.setData(clients);
            var a = client.all()[0];
            client.unpin(a);
            httpBackend.flush();
            expect(client.pinned().length).toEqual(0);
        });

        it('should return a map containing a key of the first letter by name', function () {
            client.setData(clients);
            expect(client.alphabetMap()).toEqual([{key: 'c', value: [clients[0]]}]);
        });

        it('should get an client by id', function () {
            client.setData(clients);
            expect(client.get('clientId0')).toEqual(clients[0]);
        });

        it('should find our result by name', function () {
            client.setData(clients);

            expect(client.search('ent 0')[0].id).toEqual('clientId0');
        });
    });
});
