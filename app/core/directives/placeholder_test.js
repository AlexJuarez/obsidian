define(function (require) {
    'use strict';

    require('./placeholder');
    require('angularMocks');

    var ng = require('angular');

    var template = require('tpl!./placeholder.html');

    describe('placeholder', function () {
        var compile,
            rootScope,
            scope,
            document;


        beforeEach(function () {
            module('app.core');
        });

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach(inject(function ($compile, $rootScope, $document, $templateCache) {
            $templateCache.put('core/directives/placeholder.html', template);

            // The injector unwraps the underscores (_) from around the parameter names when matching
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
        }));

        function setupPlaceholder(html) {
            var newScope = rootScope.$new();
            var elem = ng.element(html);
            compile(elem)(newScope);
            newScope.$digest();
            return(elem.isolateScope());
        }

        it('should render an image correctly', function() {
            scope = setupPlaceholder('<div class="placeholder" image="myimage.png"></div>');
            expect(scope.image).toEqual('myimage.png');
        });

        it('should take width and height correctly', function() {
            scope = setupPlaceholder('<div class="placeholder" width="300" height="250"></div>');
            expect(scope.image).toEqual('http://www.placecage.com/300/250');
        });

        it('should set styles correctly', function() {
            scope = setupPlaceholder('<div class="placeholder" style="my-style:100px"></div>');
            expect(scope.style).toEqual('my-style:100px');
        });
    });
});
