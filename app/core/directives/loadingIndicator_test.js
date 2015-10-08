define(function (require) {
    'use strict';

    require('./loadingIndicator');
    require('angularMocks');
    var template = require('tpl!./loadingIndicator.html');
    var ng = require('angular');

    // var resp = [{
    //     metrics: {
    //         count: 0,
    //         countAccounts: 0,
    //         countCampaignsPreFlight: 0,
    //         countCampaignsInFlight: 0,
    //         countCampaignsCompleted: 0,
    //         countCampaignsArchived: 0
    //     }
    // }];

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
            //httpBackend.when('GET', apiGenerator(clientSetData._getApiConfig())).respond({ clientSet: resp});
            //httpBackend.when('GET', apiGenerator(divisionSetData._getApiConfig())).respond({ divisionSet: resp});


            var scope = rootScope.$new();
            var el = ng.element(html);
            compile(el)(scope);
            scope.$digest();

            //httpBackend.flush();

            return el;
        }

        it('should render the element', function(){
            //state.params = { clientId: 'client0'};

            var el = generateEl('<div loading-indicator="clientsAreLoaded" show-loader="showLoader"></div>');

            console.log( el );
            expect(el.length).toEqual(1);
        });

        it('should have isolated scope', function(){
            
            state.params = { clientId: 'client0'};
            //console.log( 'state',state );
            var el = generateEl('<div loading-indicator></div>');
            var isoScope = el.isolateScope();
            //console.log( isoScope );

            expect(isoScope).toBeDefined();
        });



    });
});
