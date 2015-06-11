define(function (require) {
    'use strict';

    require('./data');
    require('angularMocks');

    describe('dataFactory', function () {
        var data, httpBackend, scope;

        beforeEach(function () {
            module('app.core');
            inject(function (dataFactory, $httpBackend, $rootScope) {
                data = dataFactory;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of dataFactory', function () {
            expect(data).not.toEqual(null);
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
                scope.test = 'test';
                expect(test1.all()).toEqual([1]);
            }

            scope.test = '';

            scope.$watch('test', function (newValue) {
                expect(newValue).toEqual('test');
            });

            test1.observe(callback, scope, true);

            test1.setData([1]);
        });

        it('should clean up the observers when a scope is destroyed', function () {
            var test = data();

            var counter = 0;

            function callback() {
                counter++;
            }

            test.observe(callback, scope);
            test.setData([1]);
            scope.$destroy();
            test.addData(2);

            expect(counter).toEqual(2);
        });
    });
});
