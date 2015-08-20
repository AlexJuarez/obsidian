define(function(require) {
    'use strict';

    require('./creatives');
    require('angularMocks');

    describe('creatives', function() {
        var creativesService, httpBackend, state;

        var creativesJSON = require('text!/base/assets/fixtures/creatives/creatives.json');
        var mockCacheFactory = function() {
            return {
                get: function() {
                    return {};
                },
                all: function() {
                    return creativesJSON;
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
            inject(function(creatives, $httpBackend, $state) {
                creativesService = creatives;
                httpBackend = $httpBackend;
                state = $state;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of creatives', function() {
            expect(creativesService).not.toEqual(null);
        });

        it('should return the interface we expect', function() {
            expect(typeof creativesService.all).toEqual('function');
            expect(typeof creativesService.data).toEqual('function');
            expect(typeof creativesService.observe).toEqual('function');
        });

        it('should observe the cache on observe', function() {
            var callback = function() {
                expect(true).toBe(true); // The callback was called
            };
            creativesService.observe(callback);
        });

        //TODO: re-enable this test once we turn on the actual API
        //it('should create filters correctly', function() {
        //    state.params.campaignId = '1234';
        //    expect(creativesService._filter()).toEqual('&filters=campaign.id:eq:1234');
        //    state.params.campaignId = undefined;
        //    expect(creativesService._filter()).toEqual('');
        //});

        it('should transform creatives properly', function() {
            var input = [
                {
                    id: 3,
                    name: 'Hallow\'s Eve Pumpkin Supply',
                    live: true,
                    type: 'RM',
                    device: 'Desktop',
                    embedWidth: '300',
                    embedHeight: '250',
                    expandedWidth: '600',
                    expandedHeight: '250',
                    numPlacements: 5,
                    lastModified: '2015-12-05',
                    thumbnail: 'http://www.placecage.com/600/225'
                }
            ];

            var output = creativesService._transformCreatives(input);

            expect(output.rules).toExist();
            expect(output.headers).toExist();
            expect(output.data.length).toEqual(1);
        });
    });
});
