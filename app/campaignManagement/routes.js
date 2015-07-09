/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('./clients/routes');
    require('./divisions/routes');
    require('./accounts/routes');

    require('tpl!./index.html');
    require('tpl!./campaigns/index.html');
    require('tpl!./campaigns/campaigns.summary.html');
    require('tpl!./campaigns/campaign.summary.html');
    require('tpl!./campaigns/campaigns.html');
    require('tpl!./campaigns/campaign.html');
    require('tpl!./campaigns/placements/list.html');
    require('tpl!./campaigns/placements/header.html');
    require('tpl!./campaigns/creatives/list.html');
    require('tpl!./campaigns/creatives/thumbnails.html');
    require('tpl!./campaigns/creatives/header.html');
    require('tpl!./campaigns/new-campaign.html');

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
                name: 'cm.campaigns',
                url: '?viewBy',
                templateUrl: 'campaignManagement/campaigns/index.html'
            })
            .state({
                name: 'cm.campaigns.all',
                url: '/campaigns?clientId&divisionId&accountId',
                views: {
                    'summary': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.client',
                url: '/client/:clientId',
                views: {
                    'summary': {
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
                        templateUrl: 'campaignManagement/divisions/division.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.divisions',
                url: '/divisions?clientId',
                views: {
                    'summary': {
                        templateUrl: 'campaignManagement/divisions/divisions.summary.html'
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
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.accounts',
                url: '/accounts?divisionId&clientId',
                views: {
                    'summary': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.summary.html'
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
            })
            .state({
                name: 'cm.campaigns.detail.placements',
                url: '/placements',
                views: {
                    'tab-header': {
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
                    'tab-header@cm.campaigns.detail': {
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
                    'tab-header@cm.campaigns.detail': {
                        templateUrl: 'campaignManagement/campaigns/creatives/header.html'
                    },
                    'table@cm.campaigns.detail': {
                        controller: 'creativeThumbnailsCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/thumbnails.html'
                    }
                }
            });

        buildAnalyticsRoutes('analytics');
        buildReportRoutes('reports');

        function buildReportRoutes(base) {
            $stateProvider
                .state({
                    name: base,
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.account',
                    url: '/analytics/reports/account/:accountId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail',
                    url: '/analytics/reports/campaign/:campaignId',
                    template: '<ui-view />'
                });
        }

        function buildAnalyticsRoutes(base) {
            $stateProvider
                .state({
                    name: base + '.clients',
                    url: '',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns',
                    template: '<ui-view/>'
                })
                .state({
                    name: base + '.campaigns.client',
                    url: '/dashboard/client/:clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.division',
                    url: '/dashboard/division/:divisionId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.account',
                    url: '/dashboard/account/:accountId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail',
                    url: '/campaign/:campaignId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.divisions',
                    url: '/dashboard/client/:clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.accounts',
                    url: '/dashboard/division/:divisionId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.all',
                    url: '/dashboard/account/:accountId',
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
