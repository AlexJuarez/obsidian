/* jshint -W101 */

define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('navbarService', ['dataFactory', 'clientService', 'divisionService', 'accountService', 'campaignService', function (dataFactory, clients, divisions, accounts, campaigns) {
        var navInfo = dataFactory();
        navInfo.setData({});
        clients.observe(navInfo.notifyObservers);
        accounts.observe(navInfo.notifyObservers);
        divisions.observe(navInfo.notifyObservers);
        campaigns.observe(navInfo.notifyObservers);

        function getClient(id) {
            var data = {};
            var client = clients.get(id);

            if (client) {
                data.client = client.name;
            }

            return data;
        }

        function setClient(id) {
            navInfo.setData({
                client: id
            });
        }

        function getDivision(id) {
            var data = {};
            var division = divisions.get(id);

            if (division) {
                data.division = division.name;
                var client = clients.get(division.client);
                if (client) {
                    data.client = client.name;
                }
            }

            return data;
        }

        function setDivision(id) {
            navInfo.setData({
                division: id
            });
        }

        function getAccount(id) {
            var data = {};
            var account = accounts.get(id);

            if (account) {
                data.account = account.name;
                var client = clients.get(account.client);
                var division = divisions.get(account.division);

                if (client) {
                    data.client = client.name;
                }

                if (division) {
                    data.division = division.name;
                }
            }

            return data;
        }

        function setAccount(id) {
            navInfo.setData({
                account: id
            });
        }

        function getCampaign(id) {
            var data = {};
            var campaign = campaigns.get(id);

            if (campaign) {
                data.campaign = campaign.name;
                var client = clients.get(campaign.client);
                var division = divisions.get(campaign.division);
                var account = accounts.get(account.division);

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

        function setCampaign(id) {
            navInfo.setData({
                campaign: id
            });
        }

        function all() {
            var data = navInfo.all();

            for (var x in data) {
                switch (x) {
                case 'client':
                    return getClient(data[x]);
                case 'division':
                    return getDivision(data[x]);
                case 'account':
                    return getAccount(data[x]);
                case 'campaign':
                    return getCampaign(data[x]);
                case 'default':
                    return {};
                }
            }
            return {};
        }

        return {
            setClient: setClient,
            setDivision: setDivision,
            setAccount: setAccount,
            setCampaign: setCampaign,
            observe: navInfo.observe,
            all: all
        };
    }]);
});
