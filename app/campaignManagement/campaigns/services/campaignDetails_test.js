define(function (require) {
    'use strict';

    require('./campaignDetails');
    require('angularMocks');

    describe('campaignDetailsService', function () {
        var service, httpBackend, state, apiGenerator, scope;

        beforeEach(function () {
            module('app.campaign-management');

            inject(function (campaignDetailsService, $httpBackend, $state, apiUriGenerator, $rootScope) {
                service = campaignDetailsService;
                httpBackend = $httpBackend;
                state = $state;
                apiGenerator = apiUriGenerator;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be an instance of campaignDetailsService', function () {
            expect(service).not.toEqual(null);
        });

        it('should return the correct api config', function() {
            state.params.campaignId = 1;

            expect(service._getApiConfig().queryParams.filters).toEqual(['id:eq:1']);
        });

        it('should get without initializing', function() {
            expect(service.get()).not.toEqual(null);
        });

        it('should make a request and populate the data', function() {
            var data = {
                campaigns: [{ test: 'test'}]
            };

            httpBackend.when('GET', apiGenerator(service._getApiConfig())).respond(data);

            service.observe(function() {
                expect(service.all()).toEqual(data.campaigns);
            }, scope, true);

            httpBackend.flush();
        });

    });
});
