define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var baseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=account.name:asc';
    var headerUrl = '/api/v3/accounts?dimensions=id,name&order=name:asc&metrics=countCampaigns,countCampaignsPreFlight,countCampaignsCompleted';
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

    module.service('campaignsByAccount', ['campaignCache', '$state', '$interpolate', function (cache, $state, $interpolate) {
        function idFilter(opt) {
            var filters = [];
            var params = $state.params;

            if (params.divisionId) {
                filters.push('division.id:eq:' + params.divisionId);
            } else if (params.clientId) {
                filters.push('client.id:eq:' + params.clientId);
            }

            if (opt) {
                filters.push(opt);
            }

            if (filters.length) {
                return '&filters=' + filters.join(',');
            }

            return '';
        }

        function accountUrl() {
            return headerUrl + idFilter();
        }

        function url() {
            var accountIds = getAccountIds();

            return baseUrl + idFilter('account.id:eq:' + accountIds.join(':eq:'));
        }

        function headerTransform(data) {
            return data.accounts || data;
        }

        function campaignTransform(data) {
            return data.campaigns || data;
        }

        function getAccountIds() {
            var campaignHeader = cache.get(accountUrl(), headerTransform);
            var accounts = campaignHeader.all();
            var ids = [];

            for (var i = 0; i < accounts.length; i++){
                ids.push(accounts[i].id);
            }

            return ids;
        }

        function groupByAccount() {
            var campaignCache = cache.get(url(), campaignTransform);

            var accounts = {};
            var campaigns = campaignCache.all();

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
                        impressions: campaign.metrics.impressions,
                        start: campaign.startDate,
                        end: campaign.endDate,
                        creatives: campaign.metrics.countCreatives,
                        placements: campaign.metrics.countPlacements
                    }));
                }

                return output;
            }
        }

        function showMore(accountId) {
            return function () {
                if (!limits[accountId]) {
                    limits[accountId] = 10;
                }

                limits[accountId] += 10;
            };
        }

        function all() {
            var accountInfo = cache.get(accountUrl(), headerTransform).all();
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
            var campaignHeader = cache.get(accountUrl(), headerTransform);

            campaignHeader.observe(callback, $scope, preventImmediate);
            campaignHeader.observe(function() {
                var campaignCache = cache.get(url(), campaignTransform);
                campaignCache.observe(callback, $scope);
            }, $scope, true);
        }

        return {
            _idFilter: idFilter,
            _getAccountIds: getAccountIds,
            _groupByAccount: groupByAccount,
            all: all,
            observe: observe
        };
    }]);
});
