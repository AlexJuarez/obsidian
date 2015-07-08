define(function (require) {
    'use strict';

    require('./cache');
    require('angularMocks');

    describe('cacheFactory', function () {
        var cache, httpBackend, scope;

        beforeEach(function () {
            module('app.core');
            inject(function (cacheFactory, $httpBackend, $rootScope) {
                cache = cacheFactory();
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
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
            httpBackend.when('GET', '/test')
                .respond(['success']);

            cache.observe('/test', function () {
                expect(cache.all('/test')).toEqual(['success']);
            }, scope, true);

            httpBackend.flush();
        });

        it('should return an empty data object', function () {
            expect(cache.get('/test', false)).not.toEqual(null);
        });
    });
});
