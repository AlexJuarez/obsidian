define(function (require) {
    'use strict';

    require('./analyticsChart');
    require('angularMocks');

    describe('analyticsChartService', function () {
        var httpBackend, apiGenerator, state, service;

        beforeEach(function () {
            module('app.charts');
        });

        beforeEach(inject(function ($httpBackend, apiUriGenerator, $state, analyticsChartService) {
            httpBackend = $httpBackend;
            apiGenerator = apiUriGenerator;
            state = $state;

            service = analyticsChartService;
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should get the correct url', function(){
            var interval = 'day';
            var startDate = new Date();
            state.params.clientId = 'client0';

            httpBackend.when('GET', apiGenerator(service._apiConfig(interval, startDate))).respond({});
            service.get(interval, startDate);

            httpBackend.flush();

            expect(service.exists(interval, startDate)).toEqual(true);
        });

        it('should get the correct url without startDate', function(){
            var interval = 'day';

            httpBackend.when('GET', apiGenerator(service._apiConfig(interval))).respond({});
            service.get(interval);

            httpBackend.flush();

            expect(service.exists(interval)).toEqual(true);
        });
    });
});
