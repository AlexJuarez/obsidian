define(function (require) {
    'use strict';

    require('./compile');
    require('angularMocks');

    describe('compileDirective', function () {
        var compile, rootScope, document;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
        }));

        it('should exist', function(){
            var scope = rootScope.$new();
            compile('<div compile="test"></div>')(scope);
            scope.$digest();

            expect(scope).toBeDefined();
        });


    });
});
