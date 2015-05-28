/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');
        $urlRouterProvider.when('/', '/analytics');

        $stateProvider
            .state('analytics', {
                url: '/analytics',
                parent: 'index',
                templateUrl: 'campaign-management/index.html'
            })
            .state('reports', {
                url: '/analytics/reports',
                parent: 'index',
                templateUrl: 'campaign-management/index.html'
            })
            .state('index', {
                template: '<ui-view />',
                controller: 'indexCtrl'
            })
            .state('cm', {
                url: '/campaign-management',
                controller: 'campaignManagementCtrl',
                templateUrl: 'campaign-management/index.html',
                parent: 'index'
            }).
            state({
                name: 'cm.clients',
                url: '/clients',
                controller: 'clientsCtrl',
                templateUrl: 'campaign-management/clients/index.html'
            })
            .state({
                name: 'cm.clients.detail',
                url: '/?clientId',
                views: {
                    'header': {
                        controller: 'clientCtrl',
                        templateUrl: 'campaign-management/clients/youWorkOn.html'
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
                url: '/campaigns?accountId&divisionId&clientId',
                template: '<ui-view />'
            })
            .state({
                name: 'cm.campaigns.detail',
                url: '/?campaignId',
                template: '<ui-view />'
            });

        buildGeneralRoutes('analytics');
        buildGeneralRoutes('reports');

        function buildGeneralRoutes(base) {
            $stateProvider
                .state({
                    name: base + '.clients',
                    url: '/clients',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.clients.detail',
                    url: '/?clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.divisions',
                    url: '/divisions?clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.divisions.detail',
                    url: '/?divisionId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.accounts',
                    url: '/accounts?divisionId&clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.accounts.detail',
                    url: '/accounts?accountId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns',
                    url: '/campaigns?accountId&divisionId&clientId',
                    template: '<ui-view />'
                })
                .state({
                    name: base + '.campaigns.detail',
                    url: '/?campaignId',
                    template: '<ui-view />'
                });
        }

        $locationProvider.html5Mode({ enabled: true });
    }]);
});
