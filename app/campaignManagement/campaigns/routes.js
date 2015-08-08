define(function (require) {
    'use strict';
    var app = require('./../module');

    require('./placements/routes');
    require('./creatives/routes');

    require('tpl!./index.html');
    require('tpl!./campaign.summary.html');
    require('tpl!./campaigns.html');
    require('tpl!./campaignsByStatusHeader.html');
    require('tpl!./analytics-preview.html');
    require('tpl!./services/campaignsByAccountHeader.html');
    require('tpl!./directives/campaignDetails.html');
    require('tpl!./directives/campaignsByAccount.html');
    require('tpl!./directives/campaignsByStatus.html');
    require('tpl!./new-campaign.html');

    require('tpl!./creativesList.html');
    require('tpl!./creativesThumbnails.html');
    require('tpl!./creativesHeader.html');
    require('tpl!./directives/creativeThumbnails.html');

    require('tpl!./placementsList.html');
    require('tpl!./placementsHeader.html');
    require('tpl!./services/placementTableHeader.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/campaign-management/campaign/:campaignId', '/campaign-management/campaign/:campaignId/placements');

        $stateProvider
            .state({
                name: 'cm.campaigns',
                url: '?viewBy',
                templateUrl: 'campaignManagement/campaigns/index.html'
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
            })
            .state({
                name: 'cm.campaigns.division',
                url: '/division/:divisionId',
                views: {
                    'summary': {
                        controller: 'divisionCtrl',
                        templateUrl: 'campaignManagement/divisions/division.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.account',
                url: '/account/:accountId',
                views: {
                    'summary': {
                        controller: 'accountCtrl',
                        templateUrl: 'campaignManagement/accounts/summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
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
