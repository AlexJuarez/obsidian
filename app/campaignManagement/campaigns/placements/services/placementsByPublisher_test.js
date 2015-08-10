define(function(require) {
    'use strict';

    require('./placementsByPublisher');
    require('angularMocks');

    describe('placementsByPublisher', function() {
        var placementsService, httpBackend;

        var placementsJSON = JSON.parse(require('text!/base/assets/fixtures/placements/placements.json'));

        beforeEach(function() {
            module('app.campaign-management');
            inject(function(placementsByPublisher, $httpBackend) {
                placementsService = placementsByPublisher;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of placementsByPublisher', function() {
            expect(placementsService).not.toEqual(null);
        });

        it('should return placements by publisher correctly', function() {
            var output = placementsService(placementsJSON.placements);
            var expected = [
                {
                    id: 'discovery',
                    group: {
                        name: 'Discovery',
                        placements: [
                            {
                                id: '1',
                                name: 'AnimalLover.com',
                                live: true,
                                flightStart: '2015-07-14',
                                flightEnd: '2015-08-15',
                                type: 'In-Banner',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {id: '1', name: 'Shark Week Terror'},
                                    {id: '2', name: 'Blastoise Rocks'}
                                ],
                                publisher: {id: 'discovery', name: 'Discovery'},
                                spend: 1000,
                                metrics: {impressions: 123}
                            }, {
                                id: '2',
                                name: 'AnimalApathy.com',
                                live: false,
                                flightStart: '2015-07-14',
                                flightEnd: '2015-08-15',
                                type: 'Rich Media',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [
                                    {
                                        id: '1',
                                        name: 'Shark Week Terror'
                                    }
                                ],
                                publisher: {id: 'discovery', name: 'Discovery'},
                                spend: 1000,
                                metrics: {impressions: 123}
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
                    id: 'martha',
                    group: {
                        name: 'Martha',
                        placements: [
                            {
                                id: '3',
                                name: 'AnimalHaters.com',
                                live: false,
                                flightStart: '2015-07-14',
                                flightEnd: '2015-08-15',
                                type: 'Rich Media',
                                bookedImpressions: 1234,
                                budget: 10000,
                                creatives: [{id: '2', name: 'Blastoise Rocks'}],
                                publisher: {id: 'martha', name: 'Martha'},
                                spend: 1000,
                                metrics: {impressions: 123}
                            }
                        ],
                        meta: {
                            count: 1,
                            numDelivering: 0,
                            bookedImpressions: 1234,
                            impressions: 123
                        }
                    }
                }
            ];
            expect(output).toEqual(expected);
        });
    });
});
