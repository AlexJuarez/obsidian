define(function (require) {
    'use strict';

    require('./fallbackSrc');
    require('angularMocks');

    describe('fallbackSrcDirective', function () {
        var compile, rootScope, document;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
        }));

        it('should compile', function(){
            var scope = rootScope.$new();
            compile('<img src="/imageDoesntExist.jpg" fallback-src="http://placehold.it/350x150">')(scope);
            scope.$digest();

            expect(scope).toBeDefined();
        });


    });
});
