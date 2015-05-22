/* jshint -W015 */

define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./inner.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');

    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/campaign-management', '/campaign-management/clients');

        $stateProvider
            .state('analytics', {
                url: '/analytics',
                parent: 'index'
            })
            .state('index', {
                templateUrl: 'campaign-management/index.html',
                controller: 'indexCtrl'
            })
            .state('cm', {
                url: '/campaign-management',
                controller: 'campaignManagementCtrl',
                templateUrl: 'campaign-management/inner.html',
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

        $locationProvider.html5Mode({ enabled: false });
    }]);
});
