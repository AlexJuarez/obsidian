define(function (require) {
    'use strict';

    require('./loadingIndicator');
    require('angularMocks');
    var template = require('tpl!./loadingIndicator.html');
    var ng = require('angular');

    describe('Loading Indicator Directive', function () {
        var compile, rootScope, document, httpBackend, apiGenerator, state, clientSetData, divisionSetData;

        beforeEach(function () {
            module('app.core');
        });

        beforeEach(inject(function ($compile, $rootScope, $document, $httpBackend, $templateCache, apiUriGenerator, clientSet, $state, divisionSet) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            httpBackend = $httpBackend;
            apiGenerator = apiUriGenerator;
            clientSetData = clientSet;
            divisionSetData = divisionSet;
            state = $state;

            $templateCache.put('core/directives/loadingIndicator.html', template);
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

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

        it('should have isolated scope with expressions', function(){
            
            var el = generateEl('<div loading-indicator></div>');
            var isoScope = el.isolateScope();
            
            expect(isoScope).toBeDefined();

            
        });



    });
});
