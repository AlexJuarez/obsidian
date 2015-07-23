define(function(require) {
    'use strict';

    require('./campaignsByStatusAccordionTable');
    require('angularMocks');
    var ng = require('angular');
    var $ = require('jquery');


    var campaignJSON = JSON.parse(require('text!/base/assets/fixtures/campaignsByStatus_campaigns.json'));
    var sortedCampaignJSON = JSON.parse(require('text!/base/assets/fixtures/campaignsByStatus_sortedCampaigns.json'));

    describe('campaignAccordionTableFactory', function() {
        var factory, httpBackend, scope, interpolate, apiGenerator;

        var apiConfig = {
            endpoint: 'test',
            dimensions: ['one']
        };

        var defaultData = {
            status: 'Pre-Flight',
            header: {
                observe: function() {
                },
                all: function() {
                    return {
                        preFlight: 1001
                    };
                }
            },
            title: 'preFlight',
            rows: apiGenerator(apiConfig)
        };

        beforeEach(function() {
            module('app.campaign-management');

            inject(function(campaignAccordionTableFactory, $httpBackend, $rootScope, $interpolate, apiUriGenerator) {
                factory = campaignAccordionTableFactory;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                interpolate = $interpolate;
                apiGenerator = apiUriGenerator;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTests() {
            var apiConfigWithPagination = ng.extend({}, apiConfig, {
                limit: 10,
                offset: 0
            });
            httpBackend.when('GET', apiGenerator(apiConfigWithPagination))
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
                'campaigns': [
                    {
                        'endDate': '2015-07-14',
                        'name': 'name',
                        'id': 'campaignId',
                        'metrics': {
                            'countCreatives': 22,
                            'impressions': 5444326,
                            'bookedImpressions': 0,
                            'countPlacements': 22
                        },
                        'account': {
                            'name': 'accountName',
                            'id': 'accountId'
                        },
                        'startDate': '2015-04-27',
                        'budget': 0
                    }
                ]
            };

            var expected = [
                {
                    id: 'campaignId',
                    account: {
                        id: 'accountId',
                        route: 'cm.campaigns.account({ accountId: row.account.id })',
                        name: 'accountName'
                    },
                    campaign: {route: 'cm.campaigns.detail({ campaignId: row.id })', name: 'name'},
                    impressions: {max: 0, current: 5444326},
                    start: '2015-04-27',
                    end: '2015-07-14',
                    placements: 22,
                    creatives: 22,
                    edit: ['campaign.preview', 'campaign.settings']
                }
            ];

            var test = factory();
            var result = test._transformRows(given);
            expect(result).toEqual(expected);
        });

        it('should get headers given the correct status', function() {
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
            scope.$digest();
            expect($.trim(test._getTableHeader(given))).toEqual(expected);
        });

        it('should get default headers given no status', function() {
            setUpTests();
            var test = factory();
            test.init({
                status: 'myStatus',
                title: 'My Status'
            });
            var given = [
                {status: 'yourStatus'}
            ];

            var expected = '<span class="icon-status"></span>My Status (0)';
            scope.$digest();
            expect($.trim(test._getTableHeader(given))).toEqual(expected);
        });

        it('should sort rows correctly', function() {
            setUpTests();
            var test = factory();
            test.init(defaultData);
            test.observe(function() {
                var tableData = test.all();
                if (tableData.content.data.length > 0) {
                    expect(tableData.content.data).toEqual(sortedCampaignJSON);
                }
            }, scope, true);
            httpBackend.flush();
        });
    });
});
