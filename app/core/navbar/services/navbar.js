/* jshint -W101 */

define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('navbarService', ['dataFactory', 'clientService', 'divisionService', 'accountService', 'campaignService', '$rootScope', '$state', function (dataFactory, clients, divisions, accounts, campaigns, $rootScope, $state) {
        var navInfo = dataFactory();
        navInfo.setData($state.params);
        clients.observe(navInfo.notifyObservers);
        accounts.observe(navInfo.notifyObservers);
        divisions.observe(navInfo.notifyObservers);
        campaigns.observe(navInfo.notifyObservers);

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            navInfo.setData(toParams);
        });

        function getClient(id) {
            var data = {};
            var client = clients.get(id);

            if (client) {
                data.client = client.name;
            }

            return data;
        }

        function getDivision(id) {
            var data = {};
            var division = divisions.get(id);

            if (division) {
                data.division = division.name;
                var client = clients.get(division.client.id);
                if (client) {
                    data.client = client.name;
                }
            }

            return data;
        }

        function getAccount(id) {
            var data = {};
            var account = accounts.get(id);

            if (account) {
                data.account = account.name;
                var client = clients.get(account.client.id);
                var division = divisions.get(account.division.id);

                if (client) {
                    data.client = client.name;
                }

                if (division) {
                    data.division = division.name;
                }
            }

            return data;
        }

        function getCampaign(id) {
            var data = {};
            var campaign = campaigns.get(id);

            if (campaign) {
                data.campaign = campaign.name;
                var client = clients.get(campaign.client.id);
                var division = divisions.get(campaign.division.id);
                var account = accounts.get(campaign.account.id);

                if (client) {
                    data.client = client.name;
                }

                if (account) {
                    data.account = account.name;
                }

                if (division) {
                    data.division = division.name;
                }
            }

            return data;
        }

        function all() {
            var data = navInfo.all();

            for (var x in data) {
                switch (x) {
                case 'clientId':
                    return getClient(data[x]);
                case 'divisionId':
                    return getDivision(data[x]);
                case 'accountId':
                    return getAccount(data[x]);
                case 'campaignId':
                    return getCampaign(data[x]);
                case 'default':
                    return {};
                }
            }
            return {};
        }

        return {
            setData: navInfo.setData,
            observe: navInfo.observe,
            all: all
        };
    }]);
});
