define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('topClientsService', ['$http', 'dataFactory', 'dateFormatterFilter', function ($http, dataFactory, dateFormatter) {
        var topClients = dataFactory(sortClients);

        var _apiConfig = {
            endpoint: 'clients',
            queryParams: {
                dimensions: [
                    'id', 'name', 'channel', 'lastViewedUserDate',
                    'lastViewedUserName'
                ],
                metrics: [
                    'impressions', 'countAccountsActive',
                    'countCampaignsPreFlight', 'countCampaignsInFlight'
                ],
                order: 'metrics.impressions:desc',
                limit: 10
            }
        };

        function init() {
            return topClients.init(_apiConfig, function (data) {
                return topClientsTransform(data.clients);
            });
        }

        function sortClients(data) {
            data.sort(function (a, b) {
                var ai = a.impressions;
                var bi = b.impressions;

                if (ai && bi) {
                    return bi - ai;
                }
                return 0;
            });

            return data;
        }

        function topClientsTransform(data) {
            var lastLogin, clientName;
            var output = [];

            data.forEach(function (client) {
                clientName = client.lastViewedUserName ? client.lastViewedUserName + ', ' : '';
                lastLogin = clientName + dateFormatter(client.lastViewedUserDate);
                output.push({
                    'id': client.id,
                    'channel': client.channel,
                    'client': {route: 'cm.campaigns.client({ clientId: row.id })', name: client.name },
                    'activeAccounts': client.metrics.countAccountsActive,
                    'activeCampaigns': client.metrics.countCampaignsPreFlight + client.metrics.countCampaignsInFlight,
                    'impressions': client.metrics.impressions,
                    'lastLogin': lastLogin
                });
            });

            return output;
        }

        function all() {
            return {
                'rules': {
                    'channel': '',
                    'client': 'link',
                    'activeAccounts': 'number',
                    'activeCampaigns': 'number',
                    'impressions': 'number',
                    'lastLogin': ''
                },
                'headers': [
                    {name: 'Channel', id: 'channel'},
                    {name: 'Client', id: 'client'},
                    {name: '# Active Accounts', id: 'activeAccounts'},
                    {name: '# Active Campaigns', id: 'activeCampaigns'},
                    {name: 'Impressions', id: 'impressions'},
                    {name: 'Last Client Login', id: 'lastLogin'}
                ],
                'data': topClients.all()
            };
        }

        return {
            _apiConfig: _apiConfig,
            init: init,
            observe: topClients.observe,
            transform: topClientsTransform,
            sort: sortClients,
            removeObserver: topClients.removeObserver,
            data: topClients.all,
            all: all
        };
    }]);
});
