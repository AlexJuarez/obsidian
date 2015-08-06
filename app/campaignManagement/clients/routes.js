define(function (require) {
    'use strict';
    var app = require('./../module');
    require('tpl!./index.html');
    require('tpl!./clients.summary.html');
    require('tpl!./client.summary.html');
    require('tpl!./new-edit-client.html');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state({
                name: 'cm.clients',
                url: '/clients',
                controller: 'clientsCtrl',
                templateUrl: 'campaignManagement/clients/index.html'
            });
    }]);
});
