define(function (require) {
    'use strict';
    var app = require('./../../module');

    require('tpl!./creatives.content.html');
    require('tpl!./creativesHeader.html');
    require('tpl!./directives/creativeThumbnails.html');
    require('tpl!./new-edit-creative.html');

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

        $stateProvider
            .state({
                name: 'cm.campaigns.detail.creatives',
                url: '/creatives?filter',
                views: {
                    'tab-header@cm.campaigns.detail': {
                        controller: 'creativesHeaderCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/creativesHeader.html'
                    },
                    'table@cm.campaigns.detail': {
                        controller: 'creativesCtrl',
                        templateUrl: 'campaignManagement/campaigns/creatives/creatives.content.html'
                    }
                }
            });
    }]);
});
