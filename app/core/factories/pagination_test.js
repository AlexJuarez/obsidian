define(function (require) {
    'use strict';

    require('./pagination');
    require('angularMocks');

    describe('paginationFactory', function () {
        var pagination, httpBackend;

        beforeEach(function () {
            module('app.core');
            inject(function (paginationFactory, $httpBackend) {
                pagination = paginationFactory;
                httpBackend = $httpBackend;
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

            expect(pg.buildUrl('/test', limit, offset)).toEqual('/test?limit=10&offset=0');
            expect(pg.buildUrl('/test?test=true', limit, offset)).toEqual('/test?test=true&limit=10&offset=0');
        });

        describe('init function', function() {
            it('should return the default with /test', function () {
                var pg = pagination();
                httpBackend.when('GET', '/test?limit=10&offset=0')
                    .respond([1]);
                pg.init('/test');
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

                httpBackend.when('GET', '/test?limit=10&offset=0')
                    .respond([{inner: 'test'}, {inner: 'test2'}]);
                pg.init('/test', transform);
                httpBackend.flush();
                expect(pg.all()).toEqual(['test', 'test2']);
            });

            it('should return with a the new limit', function () {
                var pg = pagination();

                httpBackend.when('GET', '/test?limit=20&offset=0')
                    .respond([1]);
                pg.init('/test', undefined, 20);
                httpBackend.flush();
                expect(pg.all()).toEqual([1]);
            });
        });

        it('should get the nextPage', function () {
            var pg = pagination();

            httpBackend.when('GET', '/test?limit=10&offset=0')
                .respond([]);

            httpBackend.when('GET', '/test?limit=10&offset=10')
                .respond([1]);

            pg.init('/test');

            httpBackend.flush();

            pg.nextPage();

            httpBackend.flush();

            expect(pg.all()).toEqual([1]);
        });
    });
});
