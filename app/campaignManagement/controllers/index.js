/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    //var ng = require('angular');

    app.controller('indexCtrl', ['$scope', 'clientService', 'divisionService', 'campaignService', 'accountService', '$rootScope', '$location', function ($scope, clients, divisions, campaigns, accounts, $rootScope, $location) {

        clients.init({
            endpoint: 'clients',
            queryParams: {
                dimensions: ['id', 'name', 'pinned']
            }
        });
        divisions.init({
            endpoint: 'divisions',
            queryParams: {
                dimensions: ['id', 'name', 'pinned', 'client.id']
            }
        });
        accounts.init({
            endpoint: 'accounts',
            queryParams: {
                dimensions: ['id', 'name', 'pinned', 'division.id', 'client.id']
            }
        });
        campaigns.init({
            endpoint: 'campaigns',
            queryParams: {
                dimensions: [
                    'id', 'name', 'pinned', 'account.id', 'division.id',
                    'client.id'
                ]
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (window.Router) {
                window.Router.handleURL($location.url());
            }
        });
    }]);
});
