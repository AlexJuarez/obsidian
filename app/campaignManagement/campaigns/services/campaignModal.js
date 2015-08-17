define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var apiConfig = {
        endpoint: 'campaigns',
        queryParams: {
            dimensions: [
                'id',
                'name',
                'creatives.type'
            ],
            metrics: [
                'impressions',
                'viewRate',
                'useractionRate',
                'clickthroughRate',
                'countPlacements',
                'video25',
                'video50',
                'video75',
                'video100'
                
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
                return data.campaigns;
            }
        });

        function filter(config, id) {
            var newConfig = ng.extend({}, config);
            newConfig.queryParams.filters = ['id:eq:' + id];
            return newConfig;
        }

        function getApiConfig(id) {
            var config = filter(apiConfig, id);
            return config;
        }
        function all() {
            var datum = cache.all( getApiConfig(campaignID) );
            var output = {
                'impressions': 0,
                'placements': 0
            };

            if (datum.length) {
                ng.forEach(datum[0].all, function (d, key){
                    output[key] = d;
                });
            }
            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(getApiConfig(), callback, $scope, preventImmediate);
        }

        function data(initialize) {
            return cache.get(getApiConfig(), initialize);
        }

        var campaignID;

        function preview(id, row) {
            console.log( '------- Open Modal ', id );

            campaignID = id;

            var campaignData = cache.get(getApiConfig(id), true);

            campaignData.observe(function() {
                var campaign = campaignData.all();
                console.log( 'campaign', campaign[0] );

                var campaignMetrics = campaign[0].metrics;
                console.log( 'campaignMetrics', campaignMetrics );
                
                if (!previewModals[id]) {
                    previewModals[id] = {
                        id: id,
                        name: row.campaign.name,
                        metrics: campaignMetrics
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
