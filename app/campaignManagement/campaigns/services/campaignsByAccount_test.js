//jshint ignore:start

define(function (require) {
    'use strict';

    require('./campaignsByAccount');
    require('./campaignCache');
    require('angularMocks');

    var ng = require('angular');

    var accountJSON = require('text!/base/assets/fixtures/campaignsByAccounts_accounts.json');
    var campaignJSON = require('text!/base/assets/fixtures/campaignsByAccounts_campaigns.json');

    describe('campaignByAccountService', function () {
        var campaigns, httpBackend, state, scope, apiGenerator;

        beforeEach(function () {
            module('app.campaign-management');
            module('app.core');

            inject(function (campaignsByAccount, $httpBackend, $state, $rootScope, apiUriGenerator) {
                campaigns = campaignsByAccount;
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
                apiGenerator = apiUriGenerator;
            });
        });

        function getPaginatedApiUri(config) {
            return apiGenerator(ng.extend({
                limit: 10,
                offset: 0
            }, config));
        }

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of campaignByAccountService', function () {
            expect(campaigns).not.toEqual(null);
        });

        function setUpTests() {
            httpBackend.when('GET', getPaginatedApiUri(campaigns._accountApiConfig))
                .respond(accountJSON);

            var headerConfig = ng.extend({
                filters: [
                    'account.id:eq:50367e93-e79a-4ac0-b35b-f62eb987b5b3:eq:070e353e-01f0-4053-b506-35a25b8c654b:eq:3bea5bbd-bf34-4b9f-89e2-1da824b1de17:eq:7d61e3dd-215b-45db-8283-2a35098ccb9f:eq:85736e92-9a63-4e3f-863c-c680654b0d84:eq:f7dee774-f5d3-416f-9a5a-d9c71ee0dab3:eq:48ebc6d2-4203-49e6-92f2-1084dfc0d0d3:eq:1acc9cc6-95fd-4805-a100-8cbd7cd6997c:eq:bc35a968-d564-4237-9ae3-b8e48c92c5a7:eq:7c2625b2-f387-40e3-8948-583908a37802'
                ]
            }, campaigns._headerApiConfig);

            httpBackend.when('GET', getPaginatedApiUri(headerConfig))
                .respond(campaignJSON);
        }

        it('should fetch the accounts for the header', function () {
            setUpTests();

            campaigns.observe(function () {
                expect(campaigns._getAccountIds()).toEqual([ '50367e93-e79a-4ac0-b35b-f62eb987b5b3', '070e353e-01f0-4053-b506-35a25b8c654b', '3bea5bbd-bf34-4b9f-89e2-1da824b1de17', '7d61e3dd-215b-45db-8283-2a35098ccb9f', '85736e92-9a63-4e3f-863c-c680654b0d84', 'f7dee774-f5d3-416f-9a5a-d9c71ee0dab3', '48ebc6d2-4203-49e6-92f2-1084dfc0d0d3', '1acc9cc6-95fd-4805-a100-8cbd7cd6997c', 'bc35a968-d564-4237-9ae3-b8e48c92c5a7', '7c2625b2-f387-40e3-8948-583908a37802' ]);
            }, scope, true);
            httpBackend.flush();
            expect(campaigns.all()[0].options.more()).toEqual(20);
            expect(campaigns.all().length).toBeTruthy();
        });
    });
});
