//jshint ignore:start

define(function (require) {
    'use strict';

    require('./campaignsByStatus');
    require('./campaignsHeader');
    require('../factories/campaignsByStatusAccordionTable');
    require('angularMocks');

    var ng = require('angular');

    var campaignJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaigns.json');
    var campaignSetJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaignSet.json');

    describe('campaignByStatusService', function () {
        var campaigns, header, httpBackend, state, scope, apiGenerator;

        beforeEach(function () {
            module('app.campaign-management');
            module('app.core');
            inject(function (campaignsByStatus, campaignsHeader, $httpBackend, $state, $rootScope, apiUriGenerator) {
                campaigns = campaignsByStatus;
                header = campaignsHeader;
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of campaignByStatusService', function () {
            expect(campaigns).not.toEqual(null);
        });

        function setUpTests() {
            httpBackend.when('GET', apiGenerator(header._apiConfig))
                .respond(campaignSetJSON);
            httpBackend.when('GET', getPaginatedApiConfig(campaigns._apiConfig, 'status:eq:inFlight'))
                .respond(campaignJSON);
            httpBackend.when('GET', getPaginatedApiConfig(campaigns._apiConfig, 'status:eq:preFlight'))
                .respond({'campaigns': []});
            httpBackend.when('GET', getPaginatedApiConfig(campaigns._apiConfig, 'status:eq:completed'))
                .respond({'campaigns': []});
            httpBackend.when('GET', getPaginatedApiConfig(campaigns._apiConfig, 'status:eq:archived'))
                .respond({'campaigns': []});
        }

        function getPaginatedApiConfig(config, filter) {
            var newConfig = ng.copy(config);
            newConfig.queryParams.limit = 10;
            newConfig.queryParams.offset = 0;
            newConfig.queryParams.filters = [filter];
        }

        it('should fetch the accounts for the header', function () {
            setUpTests();

            campaigns.observe(function () {
                expect(campaigns.all().length > 0).toEqual(true);
            }, scope, true);
            httpBackend.flush();
        });
    });
});
