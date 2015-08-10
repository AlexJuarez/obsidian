define(function (require) {
    'use strict';

    var app = require('./../module');

    require('tpl!./new-edit-account.html');
    require('tpl!./summary.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'cm.campaigns.account',
                url: '/account/:accountId',
                views: {
                    'summary': {
                        controller: 'accountCtrl',
                        templateUrl: 'campaignManagement/accounts/summary.html'
                    },
                    'content': {
                        controller: 'campaignsCtrl',
                        templateUrl: 'campaignManagement/campaigns/campaigns.html'
                    }
                }
            });
    }]);
});
