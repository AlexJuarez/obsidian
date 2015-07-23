define(function (require) {
    'use strict';

    require('./campaignCache');
    require('angularMocks');

    describe('campaignCache', function () {
        var cache, httpBackend, state;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (campaignCache, $httpBackend, $state) {
                cache = campaignCache;
                httpBackend = $httpBackend;
                state = $state;
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
                httpBackend.when('GET', '/test?limit=10&offset=0')
                    .respond({
                        test: [1, 2, 3]
                    });

                cache.get('/test', function(data) {
                    return data.test;
                });

                httpBackend.flush();

                var data = cache.get('/test', function(data) {
                    return data.test;
                });

                expect(data.all()).toEqual([1, 2, 3]);
            });
        });

    });
});
