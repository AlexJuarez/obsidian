define(function(require) {
    'use strict';

    require('./client');
    require('angularMocks');

    describe('clientService', function() {
        var client, httpBackend, apiGenerator, interpolate, records;

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

        beforeEach(function() {
            module('app.core');
            inject(function(clientService, $httpBackend, apiUriGenerator, $interpolate, clientRecordService) {
                client = clientService;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
                interpolate = $interpolate;
                records = clientRecordService;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of clientService', function() {
            expect(client).not.toEqual(null);
        });

        it('should make a request on init', function() {
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond({ clients: clients });

            client.init(apiConfig).then(function() {
                expect(client.all()).toEqual(clients);
            });
            httpBackend.flush();
        });

        it('should pin a client', function() {
            client.setData(clients);
            var firstClient = client.all()[0];
            var record = records.get(firstClient.id);

            spyOn(record, 'save');

            client.pin(firstClient);

            expect(record.save).toHaveBeenCalled();
        });

        it('should unpin a client', function() {
            client.setData(clients);
            var firstClient = client.all()[0];
            var record = records.get(firstClient.id);

            spyOn(record, 'save');

            client.unpin(firstClient);

            expect(record.save).toHaveBeenCalled();
        });

        it('should return a map containing a key of the first letter by name', function() {
            client.setData(clients);
            expect(client.alphabetMap()).toEqual([
                {
                    key: 'c',
                    value: [clients[0]]
                }
            ]);
        });

        it('should get an client by id', function() {
            client.setData(clients);
            expect(client.get('clientId0')).toEqual(clients[0]);
        });

        it('should find our result by name', function() {
            client.setData(clients);
            expect(client.search('ent 0')[0].id).toEqual('clientId0');
        });
    });
});
