define(function (require) {
    'use strict';

    var module = require('./../../module');
    var previewModals = {};
    var editModals = {};

    module.service('campaignModal', ['$modal', function ($modal) {
        function preview(id, row) {
            if (!previewModals[id]) {
                previewModals[id] = {
                    id: id,
                    name: row.campaign.name,
                    impressions: row.impressions.current
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/analytics-preview.html',
                controller: 'analyticsPreviewCtrl',
                resolve: {
                    modalState: function() {
                        return previewModals[id];
                    }
                },
                size: 'lg'
            })
        }

        function settings(id, row) {
            if (!editModals[id]) {
                editModals[id] = {id: id, name: row.campaign.name};
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-campaign.html',
                controller: 'editCampaignCtrl',
                resolve: {
                    modalState: function() {
                        return editModals[id];
                    }
                },
                size: 'lg'
            })
        }

        return {
            preview: preview,
            settings: settings
        };
    }]);
});
