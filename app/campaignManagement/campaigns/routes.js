define(function (require) {
    'use strict';
    var app = require('./../module');

    require('./placements/routes');
    require('./creatives/routes');

    require('tpl!./index.html');
    require('tpl!./campaign.summary.html');
    require('tpl!./campaigns.html');
    require('tpl!./campaign.html');
    require('tpl!./campaignsByStatusHeader.html');
    require('tpl!./analytics-preview.html');
    require('tpl!./services/campaignsByAccountHeader.html');
    require('tpl!./directives/campaignDetails.html');
    require('tpl!./directives/campaignsByAccount.html');
    require('tpl!./directives/campaignsByStatus.html');
    require('tpl!./new-campaign.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/campaign-management/campaign/:campaignId', '/campaign-management/campaign/:campaignId/placements');

        $stateProvider
            .state({
                name: 'cm.campaigns',
                url: '?viewBy',
                templateUrl: 'campaignManagement/campaigns/index.html'
            })
            .state({
                name: 'cm.campaigns.detail',
                url: '/campaign/:campaignId',
                views: {
                    'summary': {
                        controller: 'campaignCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaign.summary.html'
                    },
                    'content': {
                        controller: 'campaignCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaign.html'
                    }
                }
            });
    }]);
});
