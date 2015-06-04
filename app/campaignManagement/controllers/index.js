/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    //var ng = require('angular');

    app.controller('indexCtrl', ['$scope', 'clientService', 'divisionService', 'campaignService', 'accountService', '$rootScope', '$location', function ($scope, clients, divisions, campaigns, accounts, $rootScope, $location) {
        clients.init('/api/v3/clients?dimensions=id,name,pinned');
        divisions.init('/api/v3/divisions?dimensions=id,name,pinned,client.id');
        campaigns.init('/api/v3/campaigns?dimensions=id,name,pinned,status,startDate,client.id,account.id,division.id');
        accounts.init('/api/v3/accounts?dimensions=id,name,pinned,division.id,client.id');

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (window.Router) {
                window.Router.handleURL($location.url());
            }
        });
    }]);
});
