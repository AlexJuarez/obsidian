define(function (require) {
    'use strict';

    require('./apiURIGenerator');
    require('angularMocks');

    describe('apiUriGenerator', function () {
        var uriGeneratorService, httpBackend;

        beforeEach(function () {
            module('app.core');
            inject(function (apiUriGenerator, $httpBackend) {
                uriGeneratorService = apiUriGenerator;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of apiURIGenerator', function () {
            expect(uriGeneratorService).not.toEqual(null);
        });


        it('should return false if validation fails', function() {
            var given = {};
            var expected = false;
            expect(uriGeneratorService(given)).toEqual(expected);
        });

        it('should return a valid api uri given a simple config', function() {
            var given = {
                endpoint: 'endpoint',
                dimensions: ['dimension1', 'dimension2']
            };
            var expected = '/api/v3/endpoint?dimensions=dimension1,dimension2';

            expect(uriGeneratorService(given)).toEqual(expected);
        });

        it('should return a valid api uri given a complex config', function() {
            var given = {
                endpoint: 'endpoint',
                dimensions: ['dimension1', 'dimension2'],
                version: 123,
                metrics: ['metric1'],
                offset: 100,
                limit: 10,
                order: 'dimension1:desc',
                filters: ['dimension2:eq:5']
            };
            var expected = '/api/v123/endpoint?dimensions=dimension1,dimension2&metrics=metric1&offset=100&limit=10&order=dimension1:desc&filters=dimension2:eq:5';

            expect(uriGeneratorService(given)).toEqual(expected);
        });
    });
});
