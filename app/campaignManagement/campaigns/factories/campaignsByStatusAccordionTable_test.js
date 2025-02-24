define(function(require) {
    'use strict';

    require('./campaignsByStatusAccordionTable');
    require('angularMocks');
    var ng = require('angular');

    var campaignJSON = JSON.parse(require('text!/base/assets/fixtures/campaignsByStatus_campaigns.json'));
    var sortedCampaignJSON = JSON.parse(require('text!/base/assets/fixtures/campaignsByStatus_sortedCampaigns.json'));

    describe('campaignByStatusAccordionTableFactory', function() {
        var factory, httpBackend, scope, interpolate, apiGenerator, state;

        var apiConfig = {
            endpoint: 'test',
            queryParams: {
                dimensions: ['one']
            }
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
            rowsConfig: apiConfig
        };

        beforeEach(function() {
            module('app.campaign-management');

            inject(function(campaignAccordionTableFactory, $httpBackend, $rootScope, $interpolate, apiUriGenerator, $state) {
                factory = campaignAccordionTableFactory;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                interpolate = $interpolate;
                apiGenerator = apiUriGenerator;
                state = $state;
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        function setUpTests() {
            var apiConfigWithPagination = ng.copy(apiConfig);
            apiConfigWithPagination.queryParams.offset = 0;
            apiConfigWithPagination.queryParams.limit = 10;

            httpBackend.when('GET', apiGenerator(apiConfigWithPagination))
                .respond(campaignJSON);
        }

        it('should be an instance of campaignAccordionTableFactory', function () {
            expect(factory).not.toEqual(null);
        });

        it('should init and return some data', function () {
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

        it('should transform rows correctly', function () {
            setUpTests();
            var given = [
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
                    'live': false,
                    'spend': 0,
                    'startDate': '2015-04-27',
                    'budget': 0
                }
            ];

            var expected = [
                {
                    id: 'campaignId',
                    account: {
                        id: 'accountId',
                        route: 'cm.campaigns.account({ accountId: row.account.id })',
                        name: 'accountName'
                    },
                    campaign: {
                        route: 'cm.campaigns.detail({ campaignId: row.id })',
                        name: 'name'
                    },
                    impressions: {max: 0, current: 5444326},
                    start: '2015-04-27',
                    end: '2015-07-14',
                    type: '',
                    placements: {
                        route: 'cm.campaigns.detail.placements({ campaignId: row.id })',
                        name: 22
                    },
                    creatives: {
                        route: 'cm.campaigns.detail.creatives({ campaignId: row.id })',
                        name: 22
                    },
                    live: false,
                    budget: {
                        budget: 0,
                        spend: 0
                    },
                    edit: ['campaign.preview', 'campaign.settings']
                }
            ];

            var test = factory();
            var result = test._transformRows(given);
            expect(result).toEqual(expected);
        });

        it('should get headers given the correct status', function () {
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

            var expected = {
                title: 'My Status',
                status: 'myStatus',
                count: 10,
                countPlacementsLive: 1
            };
            scope.$digest();
            expect(test._getTableHeader(given).locals).toEqual(expected);
        });

        it('should get default headers given no status', function () {
            setUpTests();
            var test = factory();
            test.init({
                status: 'myStatus',
                title: 'My Status'
            });
            var given = [
                {status: 'yourStatus'}
            ];

            var expected = 'My Status';
            scope.$digest();
            expect(test._getTableHeader(given).locals.title).toEqual(expected);
        });

        it('should sort rows correctly', function () {
            setUpTests();
            var test = factory();
            test.init(defaultData);
            test.observe(function () {
                var tableData = test.all();
                if(tableData.content.data.length > 0) {
                    expect(tableData.content.data).toEqual(sortedCampaignJSON);
                }
            }, scope, true);
            httpBackend.flush();
        });

        it('should remove the Account Header', function () {
            state.params.accountId = 1;
            spyOn(state, 'includes').and.callFake(function () {
                return true;
            });

            setUpTests();
            var test = factory();
            test.init(defaultData);
            test.observe(function () {
                var tableData = test.all();
                expect(test._findIndex(tableData.content.headers, 'Account')).toEqual(-1);
                expect(test._findIndex(tableData.content.headers, 'Type')).toEqual(4);
            });
            httpBackend.flush();
        });
    });
});
