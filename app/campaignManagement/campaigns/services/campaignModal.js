define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var apiConfig = {
        endpoint: 'creativeSet',
        queryParams: {
            dimensions: [
                'type'
                // 'id',
                // 'creatives.type'
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
    var editModals = {};
    var createModal;

    module.service('campaignModal', ['$modal', '$state', 'cacheFactory', function ($modal, $state, cacheFactory) {
        console.log( 'campaignModal service' );


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

        function preview(id, row) {
            console.log( '------- Open Modal ', id, row );

            var creativeSetData = cache.get(getApiConfig(id), true);

            creativeSetData.observe(function() {
                var creativeData = creativeSetData.all();
                console.log( 'creativeData', creativeData );

                
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
                    size: 'lg'
                });

            }, undefined, true);


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
            });
        }

        function create() {
            if (!createModal) {
                createModal = {};
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-campaign.html',
                controller: 'newCampaignCtrl',
                resolve: {
                    modalState: function() {
                        return createModal;
                    }
                },
                size: 'lg'
            });
        }

        return {
            preview: preview,
            settings: settings,
            create: create
        };
    }]);
});
