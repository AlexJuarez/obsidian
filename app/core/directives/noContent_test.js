define(function (require) {
    'use strict';

    require('./noContent');
    require('angularMocks');
    

    var template = require('tpl!./noContent.html');
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


    describe('noContent', function () {
        var compile, rootScope, document, httpBackend, apiGenerator, state, clientSetData, divisionSetData, campaignsHeaderData, creativesData, placementsData;

        beforeEach(function () {
            module('app.core');

        });

        beforeEach(inject(function ($compile, $document, $httpBackend, $rootScope, $state, $templateCache, apiUriGenerator, clientSet, divisionSet) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            state = $state;
            httpBackend = $httpBackend;
            apiGenerator = apiUriGenerator;
            clientSetData = clientSet;
            divisionSetData = divisionSet;
            //campaignsHeaderData = campaignsHeader;
            //creativesData = creatives;
            //placementsData = placements;            
            // campaignsHeaderData = require('app/campaignManagement/campaigns/services/campaignsHeader');
            // creativesData = require('app/campaignManagement/campaigns/creatives/services/creatives');
            // placementsData = require('app/campaignManagement/campaigns/placements/services/placements');


            $templateCache.put('core/directives/noContent.html', template);
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function generateEl(){
            httpBackend.when('GET', apiGenerator(clientSetData._getApiConfig())).respond({ clientSet: resp});
            httpBackend.when('GET', apiGenerator(divisionSetData._getApiConfig())).respond({ divisionSet: resp});
            httpBackend.when('GET', apiGenerator(campaignsHeaderData._getApiConfig())).respond({ campaignsHeader: resp});


            var scope = rootScope.$new();
            var el = ng.element('<div no-content></div>');
            compile(el)(scope);

            httpBackend.flush();

            return el;
        }

        it('should fetch the data for clientSet', function(){
            console.log( 'divisionSetData', divisionSetData );
            // state.params = { clientId: 'client0'};

            // var el = generateEl();
            
            // expect(el.scope().summary).toEqual(jasmine.objectContaining(resp[0].metrics));
        });

        // it('should fetch the data for divisionSet', function(){
        //     state.params = { divisionId: 'division0' };

        //     var el = generateEl();

        //     expect(el.scope().summary).toEqual(jasmine.objectContaining(resp[0].metrics));
        // });

    });
});
