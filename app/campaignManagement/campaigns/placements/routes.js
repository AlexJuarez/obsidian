define(function (require) {
    'use strict';
    var app = require('./../../module');

    require('tpl!./placementsList.html');
    require('tpl!./placementsHeader.html');
    require('tpl!./new-edit-placement.html');
    require('tpl!./services/placementTableHeader.html');

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
