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

    var previewModals = {};
    var settingsModals = {};

    module.service('campaignModal', ['$modal', '$state', 'cacheFactory', function ($modal, $state, cacheFactory) {

        var cache = cacheFactory({
            transform: function (data) {
                return data.creativeSet;
            }
        });

        function filter(config, id) {
            var newConfig = ng.extend({}, config);
            newConfig.queryParams.filters = ['campaign.id:' + id];
            return newConfig;
        }

        function getApiConfig(id) {
            var config = filter(apiConfig, id);
            return config;
        }

        var creativeData = [
            {
                metrics: {
                    placements: 0,
                    impressions: 0,
                    viewRate: 0,
                    useractionRate: 0,
                    clickthroughRate: 0,
                    averagePercentComplete: 0
                }
            }
        ];

        function preview(id, row) {

            var creativeSetData = cache.get(getApiConfig(id), true);

            creativeSetData.observe(function() {
                creativeData = creativeSetData.all();

                var modalSize;
                if (creativeData.length <= 1) {
                    modalSize = 'sm';
                    
                } else if (creativeData.length <= 2) {
                    modalSize = 'md';
                    
                } else {
                    modalSize = 'lg';
                }
                
                if (!previewModals[id]) {
                    previewModals[id] = {
                        id: id,
                        name: row.campaign.name,
                        impressions: row.impressions.current,
                        creativeData: creativeData
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
                    size: modalSize
                });

            }, undefined, true);


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
