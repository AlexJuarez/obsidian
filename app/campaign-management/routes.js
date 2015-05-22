/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');

        $stateProvider
            .state('analytics', {
                url: '/analytics',
                parent: 'index',
                templateUrl: 'campaign-management/index.html'
            })
            .state('analytics.clients', {
                url: '/clients'
            })
            .state('analytics.clients.detail', {
                url: '/:clientId'
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
            })
                .state('cm.clients', {
                    url: '/clients',
                    templateUrl: 'campaign-management/clients/index.html'
                })
                    .state('cm.clients.detail', {
                        url: '/:clientId',
                        views: {
                            'header': {
                                controller: 'clientCtrl',
                                templateUrl: 'campaign-management/clients/youWorkOn.html'
                            }
                        }
                    })
                .state('cm.divisions', {
                    url: '/divisions',
                    template: '<ui-view />'
                })
                    .state('cm.divisions.detail', {
                        url: '/:divisionId',
                        controller: 'divisionCtrl',
                        template: '<ui-view />'
                    });

        $locationProvider.html5Mode({ enabled: true });
    }]);
});
