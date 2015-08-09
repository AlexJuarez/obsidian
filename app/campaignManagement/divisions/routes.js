define(function (require) {
    'use strict';
    var app = require('./../module');

    require('tpl!./division.summary.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'cm.campaigns.division',
                url: '/division/:divisionId',
                views: {
                    'summary': {
                        controller: 'divisionCtrl',
                        templateUrl: 'campaignManagement/divisions/division.summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            });
    }]);
});
