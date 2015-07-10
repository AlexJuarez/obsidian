define(function (require) {
    'use strict';

    require('./clientSet');
    require('angularMocks');
    var data = require('text!/base/assets/fixtures/clientSet.json');

    describe('clientSet', function () {
        var metrics, httpBackend, state, scope;

        beforeEach(function () {
            module('app.core');
            inject(function (clientSet, $httpBackend, $state, $rootScope) {
                metrics = clientSet;
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
            httpBackend.when('GET', '/api/v3/clientSet?metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived,count').respond(resp);
        }

        describe('url()', function () {
            it('should return the correct url with no state', function () {
                expect(metrics.url()).toEqual('/api/v3/clientSet?metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived,count');
            });

            it('should return a url with a filter', function () {
                state.params.clientId = 'client0';

                expect(metrics.url()).toEqual('/api/v3/clientSet?metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived,count&filters=id:eq:client0');
            })
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
        })

    });
});
