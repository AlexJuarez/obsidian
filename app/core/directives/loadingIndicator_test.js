define(function (require) {
    'use strict';

    require('./loadingIndicator');
    require('angularMocks');
    var ng = require('angular');

    describe('Loading Indicator Directive', function () {
        var compile, rootScope;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope) {
            compile = $compile;
            rootScope = $rootScope;
        }));

        function generateEl(html){

            var scope = rootScope.$new();
            var el = ng.element(html);
            compile(el)(scope);
            scope.$digest();

            return el;
        }

        it('should render the element', function(){
            var el = generateEl('<div loading-indicator="clientsAreLoaded" show-loader="showLoader"></div>');

            expect(el.length).toEqual(1);
        });

        it('should have scope with expressions', function(){
            var el = generateEl('<div loading-indicator></div>');
            var scope = el.scope();

            expect(scope).toBeDefined();
        });



    });
});
