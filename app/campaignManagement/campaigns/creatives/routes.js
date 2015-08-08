define(function (require) {
    'use strict';
    var app = require('./../../module');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/campaign-management/campaign/:campaignId/creatives', '/campaign-management/campaign/:campaignId/creatives/list');

        $stateProvider
            .state({
                name: 'cm.campaigns.detail.creatives',
                url: '/creatives?filter'
            })
            .state({
                name: 'cm.campaigns.detail.creatives.list',
                url: '/list',
                views: {
                    'tab-header@cm.campaigns.detail': {
                        controller: 'creativesHeaderCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/creativesHeader.html'
                    },
                    'table@cm.campaigns.detail': {
                        controller: 'creativesListCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/creativesList.html'
                    }
                }
            })
            .state({
                name: 'cm.campaigns.detail.creatives.thumbnails',
                url: '/thumbnails',
                views: {
                    'tab-header@cm.campaigns.detail': {
                        controller: 'creativesHeaderCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/creativesHeader.html'
                    },
                    'table@cm.campaigns.detail': {
                        templateUrl: 'campaignManagement/campaigns/creatives/creativesThumbnails.html'
                    }
                }
            });
    }]);
});
