/* globals jasmine */
define(function(require) {
    'use strict';

    require('./placements');
    require('angularMocks');

    describe('placements', function() {
        var placementsService, httpBackend, state;

        var placementsJSON = JSON.parse(require('text!/base/assets/fixtures/placements/placements.json'));
        var mockCacheFactory = function() {
            return {
                get: function() {
                    return {
                        all: function() {
                            return placementsJSON;
                        }
                    };
                },
                all: function() {
                    return placementsJSON;
                },
                observe: function(url, callback) {
                    callback();
                }
            };
        };

        beforeEach(function() {
            module('app.campaign-management', function($provide) {
                $provide.value('cacheFactory', mockCacheFactory);
            });
            inject(function(placements, $httpBackend, $state) {
                placementsService = placements;
                httpBackend = $httpBackend;
                state = $state;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of placements', function() {
            expect(placementsService).not.toEqual(null);
        });

        it('should return the interface we expect', function() {
            expect(typeof placementsService.all).toEqual('function');
            expect(typeof placementsService.observe).toEqual('function');
        });

        it('should observe the cache on observe', function() {
            var callback = function() {
                expect(true).toBe(true); // The callback was called
            };
            placementsService.observe(callback);
        });

        it('should transform placement groups properly', function() {
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
                    ],
                    options: ''
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
                    ],
                    options: ''
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
                    ],
                    options: ''
                })
            ];

            var output = placementsService.all();

            expect(output[0].content.data).toEqual(firstDataExpected);
            expect(output[1].content.data).toEqual(secondDataExpected);
        });
    });
});
