/* globals jasmine */
define(function(require) {
    'use strict';

    require('./placements');
    require('angularMocks');

    describe('placements', function() {
        var service, httpBackend, state, uriGenerator, scope;

        var placementsJSON = JSON.parse(require('text!/base/assets/fixtures/placements/placements.json'));

        beforeEach(function() {
            module('app.campaign-management');

            inject(function(placements, $httpBackend, $state, apiUriGenerator, $rootScope) {
                service = placements;
                httpBackend = $httpBackend;
                state = $state;
                uriGenerator = apiUriGenerator;
                scope = $rootScope.$new();
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUp() {
            httpBackend.when('GET', uriGenerator(service._getApiConfig())).respond(placementsJSON);
        }

        it('should be an instance of placements', function() {
            expect(service).not.toEqual(null);
        });

        it('should return the interface we expect', function() {
            expect(typeof service.all).toEqual('function');
            expect(typeof service.observe).toEqual('function');
        });

        it('should observe the cache on observe', function() {
            setUp();
            var callback = function() {
                expect(service.all()).not.toBeEmpty(); // The callback was called
            };

            service.observe(callback);
            httpBackend.flush();
        });

        it('should transform placement groups properly', function() {
            setUp();
            var firstDataExpected = [
                jasmine.objectContaining({
                    placementName: 'AnimalApathy.com',
                    delivering: false,
                    startDate: '2015-07-14',
                    endDate: '2015-08-15',
                    type: 'RM',
                    pacing: {current: 123, max: 1234},
                    spend: {current: 1000, max: 10000},
                    creatives: [
                        {
                            id: '1',
                            name: 'Shark Week Terror'
                        }
                    ]
                }), jasmine.objectContaining({
                    placementName: 'AnimalLover.com',
                    delivering: true,
                    startDate: '2015-07-14',
                    endDate: '2015-08-15',
                    type: 'IBV',
                    pacing: {current: 123, max: 1234},
                    spend: {current: 1000, max: 10000},
                    creatives: [
                        {
                            id: '1',
                            name: 'Shark Week Terror'
                        }, {id: '2', name: 'Blastoise Rocks'}
                    ]
                })
            ];

            var secondDataExpected = [
                jasmine.objectContaining({
                    placementName: 'AnimalHaters.com',
                    delivering: false,
                    startDate: '2015-07-14',
                    endDate: '2015-08-15',
                    type: 'RM',
                    pacing: {current: 123, max: 1234},
                    spend: {current: 1000, max: 10000},
                    creatives: [
                        {
                            id: '2',
                            name: 'Blastoise Rocks'
                        }
                    ]
                })
            ];

            var callback = function() {
                var output = service.all();
                expect(output[0].content.data).toEqual(firstDataExpected);
                expect(output[1].content.data).toEqual(secondDataExpected);
            };

            service.observe(callback, scope, true);
            httpBackend.flush();
        });

        /*it('should select the placement by id', function() {
            expect(output[0].content.data[0].selectPlacement(id));
        }); */
    });
});
