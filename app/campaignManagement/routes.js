/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/content.html');
    require('tpl!./clients/new-client.html');
    require('tpl!./divisions/divisions.html');
    require('tpl!./divisions/youWorkOn.html');
    require('tpl!./campaigns/index.html');
    require('tpl!./campaigns/campaigns.html');
    require('tpl!./campaigns/campaignsByAccount.html');
    require('tpl!./campaigns/campaign.html');
    require('tpl!./campaigns/placements/list.html');
    require('tpl!./campaigns/creatives/list.html');
    require('tpl!./campaigns/creatives/thumbnails.html');
    require('tpl!./campaigns/new-campaign.html');
    require('tpl!./accounts/index.html');
    require('tpl!./accounts/new-account.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
        //httpProvider settings
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('domainInterceptor');

        //urlRouter Settings
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');
        $urlRouterProvider.when('/campaign-management/campaign/:campaignId/creatives', '/campaign-management/campaign/:campaignId/creatives/list');
        $urlRouterProvider.when('/campaign-management/campaign/:campaignId', '/campaign-management/campaign/:campaignId/placements');
        if (!window.disableRouter) {
            $urlRouterProvider.when('/', '/analytics');
        }

        //Routes
        $stateProvider
            .state('analytics', {
                url: '/analytics',
                parent: 'index',
                templateUrl: 'campaignManagement/index.html'
            })
            .state('index', {
                template: '<ui-view />',
                controller: 'indexCtrl'
            })
            .state('cm', {
                url: '/campaign-management',
                controller: 'campaignManagementCtrl',
                templateUrl: 'campaignManagement/index.html',
                parent: 'index'
            })
            .state({
                name: 'cm.clients',
                templateUrl: 'campaignManagement/clients/index.html'
            })
            .state({
                name: 'cm.clients.all',
                url: '/clients',
                views: {
                    'content': {
                        controller: 'clientsCtrl',
                        templateUrl: 'campaignManagement/clients/content.html'
                    }
                }
            })
            .state({
                name: 'cm.divisions',
                templateUrl: 'campaignManagement/divisions/index.html'
            })
            .state({
                name: 'cm.divisions.all',
                url: '/divisions?clientId',
                views: {
                    'content': {
                        controller: 'divisionsCtrl',
                        templateUrl: 'campaignManagement/divisions/divisions.html'
                    }
                }
            })
            .state({
                name: 'cm.accounts',
                templateUrl: 'campaignManagement/accounts/index.html'
            })
            .state({
                name: 'cm.accounts.all',
                url: '/accounts?divisionId&clientId',
                controller: 'accountsCtrl'
            })
            .state({
                name: 'cm.campaigns',
                templateUrl: 'campaignManagement/campaigns/index.html'
            })
            .state({
                name: 'cm.campaigns.all',
                url: '/campaigns?accountId&divisionId&clientId',
                views: {
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.all.account',
                url: '/account',
                views: {
                    'tab-content': {
                        templateUrl: 'campaignManagement/campaigns/campaignsByAccount.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail',
                url: '/campaign/:campaignId',
                views: {
                    'content': {
                        controller: 'campaignCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaign.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail.placements',
                url: '/placements',
                views: {
                    'header': {
                        templateUrl: 'campaignManagement/campaigns/placements/header.html'
                    },
                    'table': {
                        controller: 'placementListCtrl',
                        templateUrl: 'campaignManagement/campaigns/placements/list.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail.creatives',
                url: '/creatives'
            })
            .state({
                name: 'cm.campaigns.detail.creatives.list',
                url: '/list',
                views: {
                    'header@cm.campaigns.detail': {
                        templateUrl: 'campaignManagement/campaigns/creatives/header.html'
                    },
                    'table@cm.campaigns.detail': {
                        controller: 'creativeListCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/list.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail.creatives.thumbnails',
                url: '/thumbnails',
                views: {
                    'header@cm.campaigns.detail': {
                        templateUrl: 'campaignManagement/campaigns/creatives/header.html'
                    },
                    'table@cm.campaigns.detail': {
                        controller: 'creativeThumbnailsCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/thumbnails.html'
                    }
                }
            });
        buildGeneralRoutes('analytics');
        buildGeneralRoutes('reports');

        function buildGeneralRoutes(base) {
            $stateProvider
                .state({
                    name: base + '.clients',
                    url: '/client',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.clients.all',
                    url: '/',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.clients.detail',
                    url: '/:clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.divisions',
                    url: '/division',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.divisions.all',
                    url: '/',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.divisions.detail',
                    url: '/:divisionId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.accounts',
                    url: '/account',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.accounts.detail',
                    url: '/:accountId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns',
                    url: '/campaign',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.all',
                    url: '/',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail',
                    url: '/:campaignId',
                    template: '<ui-view />'
                })
                .state(base + '.catch', {
                    url: '/*path',
                    template: '<ui-view />'
                });
        }

        $locationProvider.html5Mode({ enabled: !window.disableRouter });
    }]);
});
