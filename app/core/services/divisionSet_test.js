define(function (require) {
    'use strict';

    require('./divisionSet');
    require('angularMocks');
    var data = require('text!/base/assets/fixtures/divisionSet.json');
    var baseUrl = '/api/v3/divisionSet?metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived,count';

    describe('division', function () {
        var metrics, httpBackend, state, scope;

        beforeEach(function () {
            module('app.core');
            inject(function (divisionSet, $httpBackend, $state, $rootScope) {
                metrics = divisionSet;
                httpBackend = $httpBackend;
                state = $state;
                scope = $rootScope.$new();
            });
        });

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTest(resp) {
            httpBackend.when('GET', baseUrl).respond(resp);
        }

        describe('url()', function () {
            it('should return the correct url with no state', function () {
                expect(metrics.url()).toEqual(baseUrl);
            });

            it('should return a url with a filter', function () {
                state.params.divisionId = 'division0';

                expect(metrics.url()).toEqual(baseUrl + '&filters=id:eq:division0');
            })
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
        })

    });
});
