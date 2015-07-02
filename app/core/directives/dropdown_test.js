define(function (require) {
    'use strict';

    require('./dropdown');
    require('angularMocks');
    var ng = require('angular');

    describe('dropdownDirective', function () {
        var compile, rootScope, document, timeout;
        var html, element;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document, $timeout) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            timeout = $timeout;

            element = ng.element(
                '<div>' +
                    '<div class="dropdown-toggle"></div>' +
                '</div>' +
                '<div>' +
                    '<div id="other"></div>' +
                '</div>'
            );

            var scope = rootScope.$new();
            html = compile(element)(scope);
            scope.$digest();
        }));

        it('should select element on click', function(){
            element.find('.dropdown-toggle').click();

            var scope = element.find('.dropdown-toggle').isolateScope();

            expect(scope.selected).toEqual(true);
        });

        it('should mark element clicked on click', function(){
            element.find('.dropdown-toggle').click();

            var scope = element.find('.dropdown-toggle').isolateScope();

            expect(scope.clicked).toEqual(true);
        });

        it('should not be clicked.', function(){
            element.find('.dropdown-toggle').click();

            var scope = element.find('.dropdown-toggle').isolateScope();

            document.click();

            expect(scope.clicked).toEqual(false);
        });

        it('should not be clicked.', function(){
            element.find('.dropdown-toggle').parent().click();

            var scope = element.find('.dropdown-toggle').isolateScope();

            document.click();

            expect(scope.clicked).toEqual(false);
        });

        it('should get destroyed', function() {
            element.find('.dropdown-toggle').click();

            var scope = element.find('.dropdown-toggle').isolateScope();
            expect(scope.clicked).toEqual(true); //ensure it exists.

            function destroyAndDigest(callbackExpect) {
                setTimeout(function(){
                    scope.$destroy();
                    scope.$digest();
                    if(typeof callbackExpect === 'function'){
                        callbackExpect();
                    }
                },3000);
            }

            function expectDestroyed(){
                expect(scope.destroyed).toBe(true);
            }

            destroyAndDigest(expectDestroyed);
        });

    });
});
