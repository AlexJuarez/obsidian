define(function (require) {
    'use strict';
    var app = require('./../module');

    require('tpl!./index.content.html');
    require('tpl!./index.summary.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'analytics.campaigns.division',
                url: '/division/:divisionId',
                views: {
                    'summary': {
                        templateUrl: 'analytics/divisions/index.summary.html'
                    },
                    'content': {
                        templateUrl: 'analytics/divisions/index.content.html',
                        controller: 'divisionCtrl'
                    }
                }
            });
    }]);
});
