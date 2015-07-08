define(function (require) {
    'use strict';

    require('./campaignsHeader');
    require('angularMocks');

    var campaignSetJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaignSet.json');

    describe('campaignsHeader', function () {
        var header, httpBackend, state, scope;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (campaignsHeader, $httpBackend, $state, $rootScope) {
                header = campaignsHeader;
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTests(filter) {
            filter = filter || '';
            httpBackend.when('GET', '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive' + filter)
                .respond(campaignSetJSON);
        }

        it('should be an instance of campaignsHeader', function () {
            expect(header).not.toEqual(null);
        });

        it('should produce the correct url', function () {
            state.params.clientId = 'client1';
            expect(header.url()).toEqual('/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive&filters=client.id:eq:client1');
        });

        it('should get all of the data', function () {
            setUpTests();

            expect(header.all()).toEqual({preFlight: 0, inFlight: 0, completed: 0, archived: 0});
            header.observe(function () {
                expect(header.all()).toEqual({ preFlight: 0, inFlight: 4027, completed: 3873, archived: 37670, unknown: 13586 });
            }, scope, true);

            httpBackend.flush();
        });

        it('should get the dataFactory object', function () {
            expect(header.data().all()).toEqual([]);
        });

        it('should populate the dataFactory object', function () {
            setUpTests();

            var data = header.data(true);
            httpBackend.flush();

            expect(data.all()).toEqual(JSON.parse(campaignSetJSON).campaignSet);
        });
    });
});
