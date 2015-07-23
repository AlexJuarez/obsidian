define(function (require) {
    'use strict';

    require('./campaignCache');
    require('angularMocks');

    describe('campaignCache', function () {
        var cache, httpBackend, state, apiGenerator;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (campaignCache, $httpBackend, $state, apiUriGenerator) {
                cache = campaignCache;
                httpBackend = $httpBackend;
                state = $state;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of campaignCache', function () {
            expect(cache).not.toEqual(null);
        });

        describe('get', function () {
            it('should only make one call per url', function () {
                var apiConfig = {
                    endpoint: 'test',
                    dimensions: 'one',
                    limit: 10,
                    offset: 0
                };

                httpBackend.when('GET', apiGenerator(apiConfig))
                    .respond({
                        test: [1, 2, 3]
                    });

                cache.get(apiConfig, function(data) {
                    return data.test;
                });

                httpBackend.flush();

                var data = cache.get(apiConfig, function(data) {
                    return data.test;
                });

                expect(data.all()).toEqual([1, 2, 3]);
            });
        });

    });
});
