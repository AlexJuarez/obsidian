define(function (require) {
    'use strict';

    var module = require('./../../module');
    var previewModals = {};
    var settingsModals = {};

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
            });
        }

        function settings(id) {
            if (!settingsModals[id]) {
                settingsModals[id] = {
                    campaignId: id,
                    action: 'Edit'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-edit-campaign.html',
                controller: 'newEditCampaignCtrl',
                resolve: {
                    modalState: function() {
                        return settingsModals[id];
                    }
                },
                size: 'lg'
            });
        }

        return {
            preview: preview,
            settings: settings
        };
    }]);
});
