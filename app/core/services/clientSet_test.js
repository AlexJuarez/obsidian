define(function (require) {
    'use strict';

    require('./clientSet');
    require('angularMocks');
    var data = require('text!/base/assets/fixtures/clientSet.json');

    describe('clientSet', function () {
        var metrics, httpBackend, state, scope, apiGenerator;

        beforeEach(function () {
            module('app.core');
            inject(function (clientSet, $httpBackend, $state, $rootScope, apiUriGenerator) {
                metrics = clientSet;
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
            httpBackend.when('GET', apiGenerator(metrics._apiConfig)).respond(resp);
        }

        describe('_getApiConfig()', function () {
            it('should return the correct url with no state', function () {
                expect(metrics._getApiConfig().filters).toEqual(undefined);
            });

            it('should return a url with a filter', function () {
                state.params.clientId = 'client0';

                expect(metrics._getApiConfig().filters).toEqual(['id:eq:client0']);
            });
        });

        it('should populate the expected fields', function () {
            setUpTest(data);

            metrics.observe(function () {
                var d = JSON.parse(data).clientSet[0].metrics;
                d.countCampaigns = d.countCampaignsPreFlight + d.countCampaignsInFlight;

                expect(metrics.all()).toEqual(d);
            }, scope, true);

            httpBackend.flush();
        });

        it('should return an object when empty', function () {
            setUpTest({clientSet: []});

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
