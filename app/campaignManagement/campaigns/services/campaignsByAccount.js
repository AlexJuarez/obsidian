//jshint ignore:start
define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var baseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=account.name:asc';
    var headerUrl = '/api/v3/accounts?dimensions=id,name&order=name:asc&metrics=countCampaigns,countCampaignsPreFlight,countCampaignsCompleted';
    var headerTemplate = require('tpl!./campaignAccountHeader.html');

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

    ];

    module.service('campaignsByAccount', ['campaignCacheService', '$state', '$interpolate', function (cache, $state, $interpolate) {
        function idFilter() {
            var filter = '';
            var params = $state.params;

            if (params.divisionId) {
                filter = 'division.id:eq:' + params.divisionId + ',';
            } else if (params.clientId) {
                filter = 'client.id:eq:' + params.clientId + ',';
            }

            return filter;
        }

        function url() {
            var accountIds = getAccountIds();

            return baseUrl + '&filters=' + idFilter() + 'account.id:eq:' + accountIds.join(':eq:');
        }

        function headerTransform(data) {
            return data.accounts || data;
        }

        function campaignTransform(data) {
            return data.campaigns || data;
        }

        function getAccountIds() {
            var campaignHeader = cache.get(headerUrl, headerTransform);
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
            return headerTemplate(account);
        }

        function all() {
            var headers = cache.get(headerUrl, headerTransform).all();
            var accounts = groupByAccount();

            for (var i = 0; i < headers.length; i++) {

            }
        }

        function observe(callback, $scope){
            ng.forEach(cache[idFilter()].rows, function (table) {
                table.observe(callback, $scope);
            });
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
