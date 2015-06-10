define(function (require) {
    'use strict';

    require('./client');
    require('angularMocks');

    describe('clientService', function () {
        var client, httpBackend;

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
            inject(function (clientService, $httpBackend) {
                client = clientService;
                httpBackend = $httpBackend;
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
            httpBackend.when('GET', '/test')
                .respond({
                    'clients': clients
                });

            client.init('/test').then(function () {
                expect(client.all()).toEqual(clients);
            });
            httpBackend.flush();
        });

        it('should pin an client', function () {
            client.setData(clients);
            var a = client.all()[0];
            client.pin(a);
            expect(client.pinned().length).toEqual(1);
        });

        it('should unpin an client', function () {
            client.setData(clients);
            var a = client.all()[0];
            client.pin(a);
            client.unpin(a);
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
    });
});
