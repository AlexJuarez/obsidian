define(function (require) {
    'use strict';

    require('./youWorkOn');
    require('angularMocks');
    var template = require('tpl!./youWorkOn.html');
    var ng = require('angular');

    var resp = [{
        metrics: {
            count: 0,
            countAccounts: 5,
            countCampaignsPreFlight: 15,
            countCampaignsInFlight: 20,
            countCampaignsCompleted: 25,
            countCampaignsArchived: 30
        }
    }];

    describe('youWorkOn', function () {
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

            $templateCache.put('core/directives/youWorkOn.html', template);
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function generateEl(){
            httpBackend.when('GET', apiGenerator(clientSetData._getApiConfig())).respond({ clientSet: resp});
            httpBackend.when('GET', apiGenerator(divisionSetData._getApiConfig())).respond({ divisionSet: resp});


            var scope = rootScope.$new();
            var el = ng.element('<div you-work-on></div>');
            compile(el)(scope);

            httpBackend.flush();

            return el;
        }

        it('should fetch the data for clientSet', function(){
            state.params = { clientId: 'client0'};

            var el = generateEl();

            expect(el.scope().summary).toEqual(jasmine.objectContaining(resp[0].metrics));
        });

        it('should fetch the data for divisionSet', function(){
            state.params = { divisionId: 'division0' };

            var el = generateEl();

            expect(el.scope().summary).toEqual(jasmine.objectContaining(resp[0].metrics));
        });

    });
});
