define(function (require) {
    'use strict';
    var app = require('./../module');

    require('tpl!./index.content.html');
    require('tpl!./index.summary.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'analytics.campaigns.account',
                url: '/account/:accountId',
                views: {
                    'summary': {
                        templateUrl: 'analytics/accounts/index.summary.html'
                    },
                    'content': {
                        templateUrl: 'analytics/accounts/index.content.html',
                        controller: 'accountCtrl'
                    }
                }
            });
    }]);
});
