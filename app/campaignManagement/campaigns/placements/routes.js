define(function (require) {
    'use strict';
    var app = require('./../../module');

    return app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state({
                name: 'cm.campaigns.detail.placements',
                url: '/placements',
                views: {
                    'tab-header': {
                        controller: 'placementsHeader',
                        templateUrl: 'campaignManagement/campaigns/placements/placementsHeader.html'
                    },
                    'table': {
                        controller: 'placementsListCtrl',
                        templateUrl: 'campaignManagement/campaigns/placements/placementsList.html'
                    }
                }
            });
    }]);
});
