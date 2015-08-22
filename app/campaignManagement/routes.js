/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('./clients/routes');
    require('./divisions/routes');
    require('./accounts/routes');
    require('./campaigns/routes');

    require('tpl!./index.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
        //httpProvider settings
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.interceptors.push('domainInterceptor');

        //urlRouter Settings
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');
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
                    url: '?viewBy',
                    templateUrl: 'campaignManagement/campaigns/index.html'
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
                });
        }

        $locationProvider.html5Mode({ enabled: !window.disableRouter });
    }]);
});
