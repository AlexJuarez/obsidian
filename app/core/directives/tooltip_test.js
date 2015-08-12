define(function (require) {
    'use strict';

    var ng = require('angular');
    require('./tooltip');
    require('angularMocks');

    describe('tooltipDirective', function () {
        var compile,
            rootScope,
            document;


        beforeEach(function () {
            module('app.core');
        });

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach(inject(function ($compile, $rootScope, $document) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
        }));

        function testDimsAndClass(dims, className) {
            var scope = rootScope.$new();
            var elem = ng.element('<div tooltip="test"></div>');
            compile(elem)(scope);
            scope = elem.isolateScope();
            expect(scope.calculateClass(dims)).toBe(className);
        }

        it('should be tooltip-top-center', function () {
            var dims = {
                right: 250,
                left: 250,
                top: 60
            };

            testDimsAndClass(dims, 'tooltip-top-center');
        });

        it('should be tooltip-top-left', function () {
            var dims = {
                right: 50,
                left: 250,
                top: 60
            };

            testDimsAndClass(dims, 'tooltip-top-left');
        });

        it('should be tooltip-top-right', function () {
            var dims = {
                right: 50,
                left: 0,
                top: 60
            };

            testDimsAndClass(dims, 'tooltip-top-right');
        });

        it('should be tooltip-bottom-center', function () {
            var dims = {
                right: 250,
                left: 250,
                top: 0
            };

            testDimsAndClass(dims, 'tooltip-bottom-center');
        });

        it('should be tooltip-bottom-left', function () {
            var dims = {
                right: 50,
                left: 250,
                top: 0
            };

            testDimsAndClass(dims, 'tooltip-bottom-left');
        });

        it('should be tooltip-bottom-right', function () {
            var dims = {
                right: 50,
                left: 0,
                top: 0
            };

            testDimsAndClass(dims, 'tooltip-bottom-right');
        });
    });

});
