define(function(require) {
    'use strict';

    require('./placementsByAdType');
    require('angularMocks');

    describe('placementsByAdType', function() {
        var placementsService, httpBackend;

        var placementsJSON = JSON.parse(require('text!/base/assets/fixtures/placements/placements.json'));

        beforeEach(function() {
            module('app.campaign-management');
            inject(function(placementsByAdType, $httpBackend) {
                placementsService = placementsByAdType;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of placementsByAdType', function() {
            expect(placementsService).not.toEqual(null);
        });

        it('should return placements by ad type correctly', function() {
            var output = placementsService(placementsJSON.placements);
            var expected = [
                {
                    id: 'IBV',
                    group: {
                        name: 'IBV',
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
                            }
                        ],
                        meta: {
                            count: 1,
                            numDelivering: 1,
                            bookedImpressions: 1234,
                            impressions: 123
                        }
                    }
                }, {
                    id: 'RM',
                    group: {
                        name: 'RM',
                        placements: [
                            {
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
                            numDelivering: 0,
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
