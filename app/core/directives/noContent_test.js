define(function (require) {
    'use strict';

    require('./noContent');
    require('angularMocks');

    var noContentJSON = require('text!/base/assets/fixtures/noContentDirective.json');

    var template = require('tpl!./noContent.html');
    var ng = require('angular');

    
    var compile, rootScope, document, httpBackend, apiGenerator, state, clientSetData, divisionSetData, campaignsHeaderData, creativesData, placementsData;

    function setUp() {
        module('app.campaign-management');
        module('app.core');
        inject(function ($compile, $document, $httpBackend, $rootScope, $state, $templateCache, apiUriGenerator, clientSet, divisionSet, campaignsHeader, placements, creatives) {
            compile = $compile;
            rootScope = $rootScope;
            document = $document;
            state = $state;
            httpBackend = $httpBackend;
            apiGenerator = apiUriGenerator;
            clientSetData = clientSet;
            divisionSetData = divisionSet;
            campaignsHeaderData = campaignsHeader;
            placementsData = placements;
            creativesData = creatives;

            $templateCache.put('core/directives/noContent.html', template);
        });
    }

    function generateEl(){
        
        httpBackend.when('GET', apiGenerator(clientSetData._getApiConfig())).respond(noContentJSON);
        
        httpBackend.when('GET', apiGenerator(divisionSetData._getApiConfig())).respond(noContentJSON);
        
        httpBackend.when('GET', apiGenerator(campaignsHeaderData._getApiUriConfig())).respond(noContentJSON);

        httpBackend.when('GET', apiGenerator(placementsData._getApiConfig())).respond(noContentJSON);

        httpBackend.when('GET', apiGenerator(creativesData._getCreative())).respond(noContentJSON);


        var scope = rootScope.$new();
        var el = ng.element('<div no-content></div>');
        compile(el)(scope);

        httpBackend.flush();

        return el;
    }

    describe('No Content Directive (Client Page)', function () {
        
        beforeEach( function() {
            setUp();
        } );

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });


        // Client Level Tests
        it('should have an instance of clientSetData', function () {
            
            state.params = { clientId: 'testClient' };

            expect(clientSetData).toBeDefined();
        });

        it('should contain the variable "showAccountMsg" set to true', function(){
            state.params = { clientId: 'testClient'};

            var el = generateEl();
            var isoScope = el.isolateScope();
            
            expect(isoScope.showAccountMsg).toEqual(true);
        });

        it('should create the notification element with the appropriate message', function(){
            state.params = { clientId: 'testClient'};

            var el = generateEl();
            
            expect( el.find('.no-content').length ).toEqual(1);

            expect( el.find('h3').html() )
                .toEqual('It appears you don\'t have any accounts.');
        });
    });

    describe('No Content Directive (Division Page)', function () {
        // Division Level Tests
        beforeEach( function() {
            setUp();
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should have an instance of divisionSetData', function () {
            state.params = { divisionId: 'testClient' };
            expect(divisionSetData).toBeDefined();
        });
        
        it('should contain the variable "showAccountMsg" set to true', function(){
            state.params = { divisionId: 'testClient'};

            var el = generateEl();
            var isoScope = el.isolateScope();
            
            expect(isoScope.showAccountMsg).toEqual(true);
        });

        it('should create the notification element with the appropriate message', function(){
            state.params = { divisionId: 'testClient'};

            var el = generateEl();
            
            expect( el.find('.no-content').length ).toEqual(1);

            expect( el.find('h3').html() )
                .toEqual('It appears you don\'t have any accounts.');
        });

    });

    describe('No Content Directive (Account Page)', function () {
        // Division Level Tests
        beforeEach( function() {
            setUp();
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should have an instance of campaignsHeaderData', function () {
            state.params = { accountId: 'testClient' };
            
            expect(campaignsHeaderData).toBeDefined();
        });
        
        it('should set the variable "showCampaignMsg" to true', function(){
            state.params = { accountId: 'testClient'};

            var el = generateEl();
            var isoScope = el.isolateScope();
            
            expect(isoScope.showCampaignMsg).toEqual(true);
        });
        
        it('should create the notification element with the appropriate message', function(){
            state.params = { accountId: 'testClient'};

            var el = generateEl();
            
            expect( el.find('.no-content').length ).toEqual(1);

            expect( el.find('h3').html() )
                .toEqual('It appears you don\'t have any campaigns.');
        });

    });

    describe('No Content Directive (Campaign Page: Placements)', function () {
        // Division Level Tests
        beforeEach( function() {
            setUp();
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should have an instance of placementsData', function () {
            state.params = { campaignId: 'testClient' };
            
            expect(placementsData).toBeDefined();
        });
        
        it('should set the variable "showCampaignMsg" to true', function(){
            state.params = { campaignId: 'testClient'};
            state.current.name = 'cm.campaigns.detail.placements';

            var el = generateEl();
            var isoScope = el.isolateScope();
            
            expect(isoScope.showPlacementMsg).toEqual(true);
        });
        
        it('should create the notification element with the appropriate message', function(){
            state.params = { campaignId: 'testClient'};
            state.current.name = 'cm.campaigns.detail.placements';

            var el = generateEl();
            
            expect( el.find('.no-content').length ).toEqual(1);

            expect( el.find('h3').html() )
                .toEqual('It appears you don\'t have any placements.');
        });

    });

    describe('No Content Directive (Campaign Page: Creatives)', function () {
        // Division Level Tests
        beforeEach( function() {
            setUp();
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });
        
        it('should have an instance of campaignsHeaderData', function () {
            state.params = { campaignId: 'testClient' };
            
            expect(creativesData).toBeDefined();
        });
        
        it('should set the variable "showCreativeMsg" to true', function(){
            state.params = { campaignId: 'testClient'};
            state.current.name = 'cm.campaigns.detail.creatives';

            var el = generateEl();
            var isoScope = el.isolateScope();
            
            expect(isoScope.showCreativeMsg).toEqual(true);
        });
        
        it('should create the notification element with the appropriate message', function(){
            state.params = { campaignId: 'testClient'};
            state.current.name = 'cm.campaigns.detail.creatives';

            var el = generateEl();
            
            expect( el.find('.no-content').length ).toEqual(1);

            expect( el.find('h3').html() )
                .toEqual('It appears you don\'t have any creatives.');
        });

    });
});
