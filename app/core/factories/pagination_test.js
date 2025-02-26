define(function (require) {
    'use strict';

    require('./pagination');
    require('angularMocks');

    var ng = require('angular');

    describe('paginationFactory', function () {
        var pagination, httpBackend, apiGenerator;

        var apiConfig = {
            endpoint: 'test',
            queryParams: {
                dimensions: ['one']
            }
        };

        function getPaginatedApiConfig(config) {
            var newConfig = ng.copy(config);
            newConfig.queryParams.offset = 0;
            newConfig.queryParams.limit = 10;

            return newConfig;
        }

        function getPaginatedApiUri(config) {
            return apiGenerator(getPaginatedApiConfig(config));
        }

        beforeEach(function () {
            module('app.core');
            inject(function (paginationFactory, $httpBackend, apiUriGenerator) {
                pagination = paginationFactory;
                httpBackend = $httpBackend;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of paginationFactory', function () {
            expect(pagination).not.toEqual(null);
        });

        it('should build a valid pagination request url', function () {
            var pg = pagination();
            var limit = 10;
            var offset = 0;

            expect(pg._buildConfig(apiConfig, limit, offset)).toEqual(getPaginatedApiConfig(apiConfig));

            var newApiConfig = ng.copy(apiConfig);
            newApiConfig.dimensions = ['different', 'dimensions'];

            expect(pg._buildConfig(newApiConfig, limit, offset)).toEqual(getPaginatedApiConfig(newApiConfig));
        });

        describe('init function', function() {
            it('should return the default', function () {
                var pg = pagination();
                httpBackend.when('GET', getPaginatedApiUri(apiConfig))
                    .respond([1]);
                pg.init(apiConfig);
                httpBackend.flush();
                expect(pg.all()).toEqual([1]);
            });

            it('should return with a transform function', function () {
                var pg = pagination();

                function transform(d) {
                    for (var i = 0; i < d.length; i++) {
                        d[i] = d[i].inner;
                    }
                    return d;
                }

                httpBackend.when('GET', getPaginatedApiUri(apiConfig))
                    .respond([{inner: 'test'}, {inner: 'test2'}]);
                pg.init(apiConfig, transform);
                httpBackend.flush();
                expect(pg.all()).toEqual(['test', 'test2']);
            });

            it('should return with the new limit', function () {
                var pg = pagination();
                var newLimitConfig = ng.copy(apiConfig);
                newLimitConfig.queryParams.limit = 20;
                newLimitConfig.queryParams.offset = 0;
                httpBackend.when('GET', apiGenerator(newLimitConfig))
                    .respond([1]);
                pg.init(apiConfig, undefined, 20);
                httpBackend.flush();
                expect(pg.all()).toEqual([1]);
            });
        });

        it('should get the nextPage', function () {
            var pg = pagination();

            httpBackend.when('GET', getPaginatedApiUri(apiConfig))
                .respond([]);

            var nextPageConfig = ng.copy(apiConfig);
            nextPageConfig.queryParams.offset = 10;
            httpBackend.when('GET', apiGenerator(nextPageConfig))
                .respond([1]);

            pg.init(apiConfig);

            httpBackend.flush();

            pg.nextPage();

            httpBackend.flush();

            expect(pg.all()).toEqual([1]);
        });
    });
});
