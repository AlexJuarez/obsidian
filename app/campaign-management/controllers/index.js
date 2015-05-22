/**
 * Created by Alex on 3/2/2015.
 */
/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    //var ng = require('angular');

    app.controller('indexCtrl', ['$scope', 'clientService', 'divisionService', 'campaignService', 'accountService', '$rootScope', '$location', function ($scope, clients, divisions, campaigns, accounts, $rootScope, $location) {
        clients.init('/narwhal/clients?dimensions=id,name,pinned');
        divisions.init('/narwhal/divisions?dimensions=id,name,pinned,client.id');
        campaigns.init('/narwhal/campaigns?limit=500&dimensions=id,name,pinned,status,startDate,client.id,account.id,division.id');
        accounts.init('/narwhal/accounts?dimensions=id,name,pinned,division.id,client.id');

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (window.Router) {
                window.Router.router.handleURL($location.url());
            }
        });
    }]);
});
