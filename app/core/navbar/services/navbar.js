/* jshint -W101 */

define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

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

        var oldState = all();
        navInfo.observe(function () {
            var currentState = all();

            if(!ng.equals(oldState, currentState)){
                oldState = currentState;
                $rootScope.$broadcast('navStateChange', currentState);
            }
        });

        function getClient(id) {
            var data = {};
            var client = clients.get(id);

            if (client) {
                data.client = client;
            }

            return data;
        }

        function getDivision(id) {
            var data = {};
            var division = divisions.get(id);

            if (division) {
                data.division = division;
                var client = clients.get(division.client.id);
                if (client) {
                    data.client = client;
                }
            }

            return data;
        }

        function getAccount(id) {
            var data = {};
            var account = accounts.get(id);

            if (account) {
                data.account = account;
                var client = clients.get(account.client.id);
                var division = divisions.get(account.division.id);

                if (client) {
                    data.client = client;
                }

                if (division) {
                    data.division = division;
                }
            }

            return data;
        }

        function getCampaign(id) {
            var data = {};
            var campaign = campaigns.get(id);

            if (campaign) {
                data.campaign = campaign;
                var client = clients.get(campaign.client.id);
                var division = divisions.get(campaign.division.id);
                var account = accounts.get(campaign.account.id);

                if (client) {
                    data.client = client;
                }

                if (account) {
                    data.account = account;
                }

                if (division) {
                    data.division = division;
                }
            }

            return data;
        }

        function all() {
            var data = navInfo.all() || {};

            if (data.campaignId) {
                return getCampaign(data.campaignId);
            }
            if (data.accountId) {
                return getAccount(data.accountId);
            }
            if (data.divisionId) {
                return getDivision(data.divisionId);
            }
            if (data.clientId) {
                return getClient(data.clientId);
            }
            return {};
        }

        return {
            setData: navInfo.setData,
            observe: navInfo.observe,
            all: all,
            params: navInfo.all
        };
    }]);
});
