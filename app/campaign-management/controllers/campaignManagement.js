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

    app.controller('campaignManagementCtrl', ['$scope', 'clientService', 'divisionService', 'campaignService', 'accountService', function ($scope, clients, divisions, campaigns, accounts) {
        clients.init();
        divisions.init();
        campaigns.init();
        accounts.init();
    }]);
});
