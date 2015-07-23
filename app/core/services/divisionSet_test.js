define(function (require) {
    'use strict';

    require('./divisionSet');
    require('angularMocks');

    var ng = require('angular');

    var data = require('text!/base/assets/fixtures/divisionSet.json');

    describe('division', function () {
        var metrics, httpBackend, state, scope, apiGenerator;

        var apiConfig = {
            endpoint: 'test',
            dimensions: 'one'
        };

        beforeEach(function () {
            module('app.core');
            inject(function (divisionSet, $httpBackend, $state, $rootScope, apiUriGenerator) {
                metrics = divisionSet;
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

        function setUpTest(resp) {
            httpBackend.when('GET', apiGenerator(apiConfig)).respond(resp);
        }

        describe('_apiConfig()', function () {
            it('should return the correct _apiConfig with no state', function () {
                expect(metrics._apiConfig()).toEqual(apiConfig);
            });

            it('should return a _apiConfig with a filter', function () {
                state.params.divisionId = 'division0';

                var newConfig = ng.extend({filters: ['id:eq:division0']}, apiConfig);
                expect(metrics._apiConfig()).toEqual(newConfig);
            });
        });

        it('should populate the expected fields', function () {
            setUpTest(data);

            metrics.observe(function () {
                var d = JSON.parse(data).divisionSet[0].metrics;
                d.countCampaigns = d.countCampaignsPreFlight + d.countCampaignsInFlight;

                expect(metrics.all()).toEqual(d);
            }, scope, true);

            httpBackend.flush();
        });

        it('should return an object when empty', function () {
            setUpTest({divisionSet: []});

            metrics.observe(function () {
                expect(metrics.all()).not.toEqual([]);
            }, scope, true);

            httpBackend.flush();
        });

        it('should get the dataFactory object', function () {
            expect(metrics.data(false)).not.toBe(null);
        });

    });
});
