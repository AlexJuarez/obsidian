define(function (require) {
    'use strict';

    require('./cache');
    require('angularMocks');

    var apiConfig = {
        endpoint: 'test',
        queryParams: {
            dimensions: 'one'
        }
    };

    describe('cacheFactory', function () {
        var cache, httpBackend, scope, apiGenerator;

        beforeEach(function () {
            module('app.core');
            inject(function (cacheFactory, $httpBackend, $rootScope, apiUriGenerator) {
                cache = cacheFactory();
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of cacheFactory', function () {
            expect(cache).not.toEqual(null);
        });

        it('should call the url when created', function () {
            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond(['success']);

            cache.observe(apiConfig, function () {
                expect(cache.all(apiConfig)).toEqual(['success']);
            }, scope, true);

            httpBackend.flush();
        });

        it('should return an empty data object', function () {
            expect(cache.get(apiConfig, false)).not.toEqual(null);
        });

        it('should initialize on the second get call', function () {
            expect(cache.get(apiConfig, false).all()).toEqual([]);

            httpBackend.when('GET', apiGenerator(apiConfig))
                .respond(['success']);

            var data = cache.get(apiConfig, true);

            httpBackend.flush();

            expect(data.all()).toEqual(['success']);
        });
    });
});
