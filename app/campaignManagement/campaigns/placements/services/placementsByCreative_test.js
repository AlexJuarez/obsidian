define(function(require) {
    'use strict';

    require('./placementsByCreative');
    require('angularMocks');

    describe('placementsByCreative', function() {
        var placementsService, httpBackend;

        var placementsJSON = JSON.parse(require('text!/base/assets/fixtures/placements/placements.json'));

        beforeEach(function() {
            module('app.campaign-management');
            inject(function(placementsByCreative, $httpBackend) {
                placementsService = placementsByCreative;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of placementsByCreative', function() {
            expect(placementsService).not.toEqual(null);
        });

        it('should return placements by creative correctly', function() {
            var output = placementsService(placementsJSON.placements);
            var expected = [
                {
                    id: '2',
                    group: {
                        name: 'Blastoise Rocks',
                        placements: [
                            {
                                id: '1',
                                name: 'AnimalLover.com',
                                live: true,
                                startDate: '2015-07-14',
                                endDate: '2015-08-15',
                                type: 'IBV',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {id: '1', name: 'Shark Week Terror'},
                                    {id: '2', name: 'Blastoise Rocks'}
                                ],
                                publisher: {
                                    id: 'discovery',
                                    name: 'Discovery'
                                },
                                metrics: {impressions: 123, spend: 1000}
                            }, {
                                id: '3',
                                name: 'AnimalHaters.com',
                                live: false,
                                startDate: '2015-07-14',
                                endDate: '2015-08-15',
                                type: 'RM',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {
                                        id: '2',
                                        name: 'Blastoise Rocks'
                                    }
                                ],
                                publisher: {id: 'martha', name: 'Martha'},
                                metrics: {impressions: 123, spend: 1000}
                            }
                        ],
                        meta: {
                            count: 2,
                            numDelivering: 1,
                            bookedImpressions: 2468,
                            impressions: 246
                        }
                    }
                }, {
                    id: '1',
                    group: {
                        name: 'Shark Week Terror',
                        placements: [
                            {
                                id: '1',
                                name: 'AnimalLover.com',
                                live: true,
                                startDate: '2015-07-14',
                                endDate: '2015-08-15',
                                type: 'IBV',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {
                                        id: '1',
                                        name: 'Shark Week Terror'
                                    }, {id: '2', name: 'Blastoise Rocks'}
                                ],
                                publisher: {
                                    id: 'discovery',
                                    name: 'Discovery'
                                },
                                metrics: {impressions: 123, spend: 1000}
                            }, {
                                id: '2',
                                name: 'AnimalApathy.com',
                                live: false,
                                startDate: '2015-07-14',
                                endDate: '2015-08-15',
                                type: 'RM',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {
                                        id: '1',
                                        name: 'Shark Week Terror'
                                    }
                                ],
                                publisher: {
                                    id: 'discovery',
                                    name: 'Discovery'
                                },
                                metrics: {impressions: 123, spend: 1000}
                            }
                        ],
                        meta: {
                            count: 2,
                            numDelivering: 1,
                            bookedImpressions: 2468,
                            impressions: 246
                        }
                    }
                }
            ];
            expect(output).toEqual(expected);
        });
    });
});
