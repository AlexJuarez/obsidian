define(function (require) {
    'use strict';

    require('./limit');
    require('angularMocks');

    describe('limitDirective', function () {
        var compile, rootScope, document;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;

        }));

        function generateScope(){
            var scope = rootScope.$new();
            compile('<div limit="test"></div>')(scope);
            scope.$digest();

            return scope;
        }

        it('should increment limit', function(){
            var scope = generateScope();
            scope.limit = 0;
            scope.more();

            expect(scope.limit).toEqual(10);
        });

    });
});
