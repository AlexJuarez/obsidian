/* jshint camelcase: false */
/* jshint -W098 */
/* jshint -W004 */
/* jshint -W101 */

'use strict';

define(function (require) {
    var app = require('./../module');
    //var ng = require('angular');

    app.controller('indexCtrl', ['$scope', 'clientService', 'divisionService', 'campaignService', 'accountService', '$rootScope', '$location', function ($scope, clients, divisions, campaigns, accounts, $rootScope, $location) {

        clients.init();
        divisions.init();
        accounts.init();
        campaigns.init();

        var cleanup = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (window.Router && toState.name === 'analytics.campaigns.detail') {
                window.Router.handleURL($location.url());
            }
        });

        $scope.$on('$destroy', function() {
            cleanup();
        });
    }]);
});
