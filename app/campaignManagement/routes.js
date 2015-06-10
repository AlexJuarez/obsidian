/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');
    require('tpl!./campaigns/index.html');
    require('tpl!./campaigns/content.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
        //httpProvider settings
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('domainInterceptor');

        //urlRouter Settings
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');
        $urlRouterProvider.when('/', '/analytics');

        //Routes
        $stateProvider
            .state('analytics', {
                url: '/analytics',
                parent: 'index',
                templateUrl: 'campaignManagement/index.html'
            })
            .state('reports', {
                url: '/analytics/reports',
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
            }).
            state({
                name: 'cm.clients',
                url: '/clients',
                controller: 'clientsCtrl',
                templateUrl: 'campaignManagement/clients/index.html'
            })
            .state({
                name: 'cm.clients.detail',
                url: '/?clientId',
                views: {
                    'header': {
                        controller: 'clientCtrl',
                        templateUrl: 'campaignManagement/clients/youWorkOn.html'
                    },
                    'topClients': {
                        template: '<ui-view />'
                    }
                }
            })
            .state({
                name: 'cm.divisions',
                url: '/divisions?clientId',
                template: '<ui-view />'
            })
            .state({
                name: 'cm.divisions.detail',
                url: '/?divisionId',
                controller: 'divisionCtrl',
                template: '<ui-view />'
            })
            .state({
                name: 'cm.accounts',
                url: '/accounts?divisionId&clientId',
                template: '<ui-view />'
            })
            .state({
                name: 'cm.accounts.detail',
                url: '/accounts?accountId',
                template: '<ui-view />'
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
                        templateUrl: 'campaignManagement/campaigns/content.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail',
                url: '/campaigns/:campaignId',
                views: {
                    'content': {
                        template: '<ui-view />'
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
                    name: base + '.campaigns.detail',
                    url: '/:campaignId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail.adtype',
                    url: '/adtype',
                    parent: base + '.campaigns.detail',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail.adunits',
                    url: '/adunits',
                    parent: base + '.campaigns.detail',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail.components',
                    url: '/components',
                    parent: base + '.campaigns.detail',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail.device',
                    url: '/device',
                    parent: base + '.campaigns.detail',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report',
                    url: '/report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.account',
                    url: '/account/:accountId',
                    parent: base + '.report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.campaign',
                    url: '/campaign/:campaignId',
                    parent: base + '.report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.create-custom',
                    url: '/campaign/:campaignId/create-custom',
                    parent: base + '.report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.create-standard',
                    url: '/campaign/:campaignId/create-standard',
                    parent: base + '.report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.edit-custom',
                    url: '/edit-custom/:reportId',
                    parent: base + '.report',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.report.edit-standard',
                    url: '/edit-standard/:reportId',
                    parent: base + '.report',
                    template: '<ui-view />'
                });
        }

        $locationProvider.html5Mode({ enabled: !window.disableRouter });
    }]);
});
