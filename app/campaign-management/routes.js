/**
 * Created by Alex on 3/1/2015.
 */
/**
 * Created by Alex on 3/1/2015.
 */
define(function (require) {
    'use strict';
    var app = require('./module');
    require('tpl!./index.html');
    require('tpl!./inner.html');
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');

    return app.config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {
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
                        url: '/:id',
                        views: {
                            'header': {
                                controller: 'clientCtrl',
                                templateUrl: 'campaign-management/clients/youWorkOn.html'
                            }
                        }
                    });
        $locationProvider.html5Mode({ enabled: false });
    }]);
});
