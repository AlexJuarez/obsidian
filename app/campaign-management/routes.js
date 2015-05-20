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
    require('tpl!./clients/index.html');
    require('tpl!./clients/youWorkOn.html');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('cm', {
                url: '/campaign-management',
                templateUrl: 'campaign-management/index.html',
                controller: 'campaignManagementCtrl'
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
    }]);
});
