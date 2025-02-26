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
            })
            .state({
                name: 'cm.campaigns.client',
                url: '/client/:clientId',
                views: {
                    'summary': {
                        controller: 'clientCtrl',
                        templateUrl: 'campaignManagement/clients/client.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            });
    }]);
});
