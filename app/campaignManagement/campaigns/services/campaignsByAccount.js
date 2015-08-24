define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    var campaignsApiConfig = {
        endpoint: 'campaigns',
        queryParams: {
            dimensions: [
                'id', 'name', 'startDate', 'endDate', 'budget', 'account.id',
                'account.name'
            ],
            metrics: [
                'countPlacements', 'countCreatives', 'impressions',
                'bookedImpressions'
            ],
            order: 'account.name:asc'
        }
    };

    var headerApiConfig = {
        endpoint: 'accounts',
        queryParams: {
            dimensions: ['id', 'name'],
            order: 'name:asc',
            metrics: [
                'countCampaigns', 'countCampaignsPreFlight',
                'countCampaignsCompleted'
            ]
        }
    };

    var headerTemplate = require('tpl!./campaignsByAccountHeader.html');

    var rules = {
        'campaign': 'link',
        'status': '',
        'impressions': 'bullet',
        'start': 'date',
        'end': 'date',
        'placements': 'number',
        'creatives': 'number',
        'edit': ''
    };

    var headers = [
        {name: 'Campaign', id: 'campaign'},
        {name: 'Impressions & Pacing', id: 'impressions'},
        {name: 'Start', id: 'start'},
        {name: 'End', id: 'end'},
        {name: 'Placements', id: 'placements'},
        {name: 'Creatives', id: 'creatives'},
        {name: '', id: 'edit'}
    ];

    var limits = {};

    module.service('campaignsByAccount', ['campaignCache', 'campaignsFilter', '$interpolate', 'dataFactory', function (cache, campaignsFilter, $interpolate, dataFactory) {
        var filter = dataFactory();

        function getHeaderApiConfig() {
            var accountConfig = ng.extend({}, headerApiConfig);
            accountConfig.queryParams.filters = campaignsFilter();
            return accountConfig;
        }

        function getCampaignsApiConfig() {
            var accountIds = getAccountIds();
            var opt = '';

            if (accountIds.length) {
                opt = 'account.id:eq:' + accountIds.join(':eq:');
            }

            var filteredConfig = ng.extend({}, campaignsApiConfig);
            filteredConfig.queryParams.filters = campaignsFilter(opt);
            return filteredConfig;
        }

        function headerTransform(data) {
            return data.accounts || data;
        }

        function campaignTransform(data) {
            return data.campaigns || data;
        }

        function getAccountIds() {
            var campaignHeader = cache.get(getHeaderApiConfig(), headerTransform);
            var accounts = campaignHeader.all();
            var ids = [];

            for (var i = 0; i < accounts.length; i++) {
                ids.push(accounts[i].id);
            }

            return ids;
        }

        function groupByAccount() {
            var campaignCache = cache.get(getCampaignsApiConfig(), campaignTransform);

            var accounts = {};
            var campaigns = campaignCache.filtered(filtered);


            for (var i = 0; i < campaigns.length; i++) {
                var campaign = campaigns[i];
                var accountId = campaign.account.id;

                if (!accounts[accountId]) {
                    accounts[accountId] = [];
                }

                accounts[accountId].push(campaign);
            }

            return accounts;
        }

        function header(account) {
            return $interpolate(headerTemplate)(account);
        }

        function transformRows(campaigns, accountId) {
            if(campaigns) {
                campaigns.sort(function(a, b){
                    if (b.name && a.name) {
                        return a.name.localeCompare(b.name);
                    }
                });

                var output = [];
                var campaign;
                var limit = limits[accountId] || 10;

                for (var i = 0; i < campaigns.length && i < limit; i++) {
                    campaign = campaigns[i];

                    output.push(ng.extend({
                        campaign: {
                            id: campaign.id,
                            route: 'cm.campaigns.detail({ campaignId: row.campaign.id })',
                            name: campaign.name
                        },
                        impressions: {
                            max: campaign.metrics.bookedImpressions,
                            current: campaign.metrics.impressions
                        },
                        start: campaign.startDate,
                        end: campaign.endDate,
                        creatives: campaign.metrics.countCreatives,
                        placements: campaign.metrics.countPlacements
                    }));
                }

                return output;
            }
        }

        function filtered(result) {
            if (filter.all().length) {
                var filters = filter.all()[0];
                if(filters._type === 'campaign') {
                    return result.id === filters.id;
                } else {
                    return result.account.id === filters.id;
                }
            }

            return true;
        }

        function setFilter(result) {
            filter.setData([result]);
        }

        function clearFilter() {
            filter.setData([]);
        }

        function showMore(accountId) {
            return function () {
                if (!limits[accountId]) {
                    limits[accountId] = 10;
                }

                limits[accountId] += 10;

                return limits[accountId];
            };
        }

        function all() {
            var accountInfo = cache.get(getHeaderApiConfig(), headerTransform).all();
            var accounts = groupByAccount();
            var output = [];

            for (var i = 0; i < accountInfo.length; i++) {
                var account = accountInfo[i];
                output.push({
                    header: header(account),
                    options: {
                        more: showMore(account.id)
                    },
                    content: {
                        rules: rules,
                        headers: headers,
                        data: transformRows(accounts[account.id], account.id)
                    }
                });
            }

            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            var campaignHeader = cache.get(getHeaderApiConfig(), headerTransform);

            filter.observe(callback, $scope, preventImmediate);
            campaignHeader.observe(callback, $scope, preventImmediate);
            campaignHeader.observe(function() {
                var campaignCache = cache.get(getCampaignsApiConfig(), campaignTransform);
                campaignCache.observe(callback, $scope);
            }, $scope, true);
        }

        return {
            _headerApiConfig: headerApiConfig,
            _campaignsApiConfig: campaignsApiConfig,
            _getCampaignsApiConfig: getCampaignsApiConfig,
            _getAccountIds: getAccountIds,
            _groupByAccount: groupByAccount,
            clearFilter: clearFilter,
            setFilter: setFilter,
            all: all,
            observe: observe
        };
    }]);
});
