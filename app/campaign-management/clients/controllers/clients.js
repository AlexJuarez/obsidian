'use strict';

define(function (require) {
    var app = require('./../../module');

    app.controller('clientsCtrl', ['$scope', '$http', '$timeout', 'dateFormatterFilter', function ($scope, $http, $timeout, dateFormatter) {
        //$http.get('clients?dimensions=id,name,channel,lastViewedName&metrics=impressions,countAccountsActive,countCampaignsPreFlight,countCampaignsInFlight&order=metrics.impressions&limit=10').then(function (res) {
        $http.get('/fixtures/all_clients_table.json').then(function (res) {
            $timeout(function () {
                $scope.topClients = topClientsTransform(res.data.clients);
                $scope.$apply();
            });
        });

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
    }]);
});
