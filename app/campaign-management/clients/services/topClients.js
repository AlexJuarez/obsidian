define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('topClientsService', ['$http', 'dataFactory', 'dateFormatterFilter', function ($http, dataFactory, dateFormatter) {
        var topClients = dataFactory(sortClients);

        function sortClients(transformedResponse) {
            var sortFn = function (a, b) {
                var ai = a.impressions;
                var bi = b.impressions;

                if (ai && bi) {
                    if (ai > bi) { return -1; }
                    if (ai < bi) { return 1; }
                }
                return 0;
            };

            transformedResponse.data.sort(sortFn);
            return transformedResponse;
        }

        function init(url) {
            return topClients.init(url, function (data) {
                return topClientsTransform(data.clients);
            });
        }

        function topClientsTransform(inData) {
            var outData = {
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
                'data': []
            };

            var lastLogin;
            inData.forEach(function (client) {
                lastLogin = client.lastViewedName + ', ' + dateFormatter(client.lastViewed);
                outData.data.push({
                    'id': client.id,
                    'channel': client.channel,
                    'client': {route: 'cm.clients.detail({ clientId: row.id })', name: client.name },
                    'activeAccounts': client.metrics.countAccountsActive,
                    'activeCampaigns': client.metrics.countCampaignsPreFlight + client.metrics.countCampaignsInFlight,
                    'impressions': client.metrics.impressions,
                    'lastLogin': lastLogin
                });
            });

            return outData;
        }

        return {
            init: init,
            observe: topClients.observe,
            removeObserver: topClients.removeObserver,
            all: topClients.all
        };
    }]);
});
