define(function (require) {
    'use strict';
    var app = require('./../module');

    require('tpl!./index.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'analytics.campaigns.client',
                url: '/client/:clientId',
                views: {
                    'summary': {
                        templateUrl: 'analytics/clients/index.html'
                    }
                }
            });
    }]);
});
