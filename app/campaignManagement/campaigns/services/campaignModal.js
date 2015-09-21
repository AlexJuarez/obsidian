define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var apiConfig = {
        endpoint: 'creativeSet',
        queryParams: {
            dimensions: [
                'type'
            ],
            metrics: [
                'impressions',
                'view',
                'viewRate',
                'useractionRate',
                'clickthroughRate',
                'countPlacements',
                'video25',
                'video50',
                'video75',
                'video100',
                'averagePercentComplete'

            ]
        }
    };

    var settingsModals = {};

    module.service('campaignModal', ['$modal', '$state', 'cacheFactory', function ($modal, $state, cacheFactory) {

        var cache = cacheFactory({
            transform: function (data) {
                return data.creativeSet;
            }
        });

        function filter(config, id) {
            var newConfig = ng.copy(config);
            newConfig.queryParams.filters = ['campaign.id:eq:' + id];
            return newConfig;
        }

        function getApiConfig(id) {
            var config = filter(apiConfig, id);
            return config;
        }

        function preview(id, row) {

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/analytics-preview.html',
                controller: 'analyticsPreviewCtrl',
                resolve: {
                    modalState: function() {
                        return {
                            id: id,
                            name: row.campaign.name,
                            impressions: row.impressions.current,
                            data: cache.get(getApiConfig(id), true)
                        };
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
