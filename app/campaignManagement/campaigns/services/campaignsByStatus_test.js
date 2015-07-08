//jshint ignore:start

define(function (require) {
    'use strict';

    require('./campaignsByStatus');
    require('./campaignsHeader');
    require('./../factories/campaignAccordionTable');
    require('angularMocks');

    var campaignJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaigns.json');
    var campaignSetJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaignSet.json');

    describe('campaignByStatusService', function () {
        var campaigns, httpBackend, state, scope;

        beforeEach(function () {
            module('app.campaign-management');
            inject(function (campaignsByStatus, $httpBackend, $state, $rootScope) {
                campaigns = campaignsByStatus;
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
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
            httpBackend.when('GET', '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive')
                .respond(campaignSetJSON);
            httpBackend.when('GET', '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=name:asc&filters=status:eq:inFlight&limit=10&offset=0')
                .respond(campaignJSON);
            httpBackend.when('GET', '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=name:asc&filters=status:eq:preFlight&limit=10&offset=0')
                .respond({'campaigns': []});
            httpBackend.when('GET', '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=name:asc&filters=status:eq:completed&limit=10&offset=0')
                .respond({'campaigns': []});
            httpBackend.when('GET', '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=name:asc&filters=status:eq:archived&limit=10&offset=0')
                .respond({'campaigns': []});
        }

        it('should fetch the accounts for the header', function () {
            setUpTests();

            campaigns.observe(function () {
                expect(campaigns.all().length).toBeTruthy();
            }, scope, true);
            httpBackend.flush();
        });
    });
});
