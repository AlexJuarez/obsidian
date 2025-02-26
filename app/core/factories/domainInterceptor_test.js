define(function (require) {
    'use strict';

    require('./domainInterceptor');
    require('angularMocks');

    describe('domainInterceptor', function () {
        var interceptor;

        beforeEach(function () {
            module('app.core');

            module(function ($provide) {
                $provide.constant('API_URI', '/test');
            });

            inject(function (domainInterceptor) {
                interceptor = domainInterceptor;
            });
        });

        it('should be an instance of domainInterceptor', function () {
            expect(interceptor).not.toEqual(null);
        });

        it('should add an api prefix to a request', function () {
            var config = {url: '/api/v3/test'};

            expect(interceptor.request(config)).toEqual({url: '/test/api/v3/test'});
        });


        it('should not modify requests that are not api requests', function () {
            var config = {url: '/test'};

            expect(interceptor.request(config)).toEqual({url: '/test'});
        });

        it('should not modify a request that meets the conditions for modification more than once', function () {
            var config = {url: '/api/v2/api/v3/test'};

            expect(interceptor.request(config)).toEqual({url: '/test/api/v2/api/v3/test'});
        });

        it('should return the response unmodified', function () {
            expect(interceptor.response({})).toEqual({});
        });
    });
});
