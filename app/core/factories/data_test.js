define(function (require) {
    'use strict';

    require('./data');
    require('angularMocks');

    describe('dataFactory', function () {
        var data, httpBackend;

        beforeEach(function () {
            module('app.core');
            inject(function (dataFactory, $httpBackend) {
                data = dataFactory;
                httpBackend = $httpBackend;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of dataFactory', function () {
            expect(data).not.toEqual(null);
        });

        it('should error when initialized twice', function () {
            httpBackend.when('GET', '/test')
                .respond({test: ['data']});

            var test1 = data();
            test1.init('/test');
            httpBackend.flush();
            expect(function() { test1.init('/test'); }).toThrow('service has already been initialized');
        });

        it('should be sorted', function () {
            var test1 = data(function (a) { a.sort(); return a; });
            test1.setData([2, 1]);
            expect(test1.all()).toEqual([1, 2]);
        });

        it('should be a new object with each initializer', function () {
            var test1 = data();
            test1.setData([1]);
            var test2 = data();
            expect(test2.all()).toEqual([]);
        });

        it('should return the data added', function () {
            var test1 = data();
            test1.setData([1]);
            expect(test1.all()).toEqual([1]);
        });

        it('should return get from a url', function () {
            httpBackend.when('GET', '/test')
                .respond({test: ['data']});

            var test1 = data();
            test1.init('/test', function (data) { return data.test; }).then(function () {
                expect(test1.all()).toEqual(['data']);
            });
            httpBackend.flush();
        });

        it('should add an array to the data', function () {
            var test1 = data();
            test1.addData([1]);

            expect(test1.all()).toEqual([1]);
        });

        it('should trigger observers', function () {
            var test1 = data();

            function callback() {
                expect(test1.all()).toEqual([1]);
            }

            test1.observe(callback);

            test1.setData([1]);
        });
    });
});
