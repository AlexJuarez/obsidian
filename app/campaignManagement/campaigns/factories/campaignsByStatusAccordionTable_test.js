define(function(require) {
    'use strict';

    require('./campaignsByStatusAccordionTable');
    require('angularMocks');


    var campaignJSON = require('text!/base/assets/fixtures/campaignsByStatus_campaigns.json');

    describe('campaignAccordionTableFactory', function() {
        var factory, httpBackend, scope, interpolate;

        var defaultData = {
            status: 'Pre-Flight',
            header: {
                observe: function() {
                },
                all: function() {
                    return {
                        preFlight: 1001
                    }
                }
            },
            title: 'preFlight',
            rows: '/campaigns/by/status/endpoint'
        };

        beforeEach(function() {
            module('app.campaign-management');

            inject(function(campaignAccordionTableFactory, $httpBackend, $rootScope, $interpolate) {
                factory = campaignAccordionTableFactory;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                interpolate = $interpolate;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTests() {
            httpBackend.when('GET', '/campaigns/by/status/endpoint?limit=10&offset=0')
                .respond(campaignJSON);
        }

        it('should be an instance of campaignAccordionTableFactory', function() {
            expect(factory).not.toEqual(null);
        });

        it('should init and return some data', function() {
            setUpTests();

            var test = factory();
            test.init(defaultData);
            test.observe(function() {
                var tableData = test.all();
                expect(tableData.header).toExist();
                expect(tableData.options).toExist();
                expect(tableData.content).toExist();
            }, scope, true);
            httpBackend.flush();
        });

        it('should transform rows correctly', function() {
            setUpTests();
            var given = {
                "campaigns": [
                    {
                        "endDate": "2015-07-14",
                        "name": "name",
                        "id": "campaignId",
                        "metrics": {
                            "countCreatives": 22,
                            "impressions": 5444326,
                            "bookedImpressions": 0,
                            "countPlacements": 22
                        },
                        "account": {
                            "name": "accountName",
                            "id": "accountId"
                        },
                        "startDate": "2015-04-27",
                        "budget": 0
                    }
                ]
            };

            var expected = [
                {
                    "id": "campaignId",
                    "account": {
                        "id": "accountId",
                        "route": "cm.campaigns.all({ accountId: row.account.id })",
                        "name": "accountName"
                    },
                    "campaign": {
                        "route": "cm.campaigns.detail({ campaignId: row.id })",
                        "name": "name"
                    },
                    "impressions": {"target": 0, "max": 5444326},
                    "start": "2015-04-27",
                    "end": "2015-07-14",
                    "placements": 22,
                    "creatives": 22
                }
            ];

            var test = factory();
            var result = test._transformRows(given);
            expect(result).toEqual(expected);
        });

        it('should get headers', function() {
            setUpTests();
            var test = factory();
            test.init({
                status: 'myStatus',
                title: 'My Status'
            });
            var given = [
                {status: 'yourStatus'},
                {
                    status: 'myStatus',
                    metrics: {
                        count: 10,
                        countPlacementsLive: 1
                    }
                }
            ];

            var expected = '<span class="icon-status" ng-class="{\'success\': countPlacementsLive}"></span>My Status (10)';
            scope.title = 'test';
            var elem = interpolate(test._getTableHeader(given))(scope);
            scope.$digest();
            console.log(elem);
            expect(test._getTableHeader(given)).toEqual(expected);
        });



    });
});
