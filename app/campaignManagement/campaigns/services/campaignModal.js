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
                'countPlacements',
                'countVideo25',
                'countVideo50',
                'countVideo75',
                'countVideo100'
                
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
                //console.log( '-------- campaignModal cache data', data.campaigns );
                return data.campaigns;
            }
        });

        function filter(config, id) {
            var newConfig = ng.extend({}, config);
            newConfig.queryParams.filters = ['id:eq:' + id];
            //console.log( 'newConfig', newConfig );
            return newConfig;
        }

        function getApiConfig(id) {
            //console.log( '------- campaignModal getApiConfig' );
            var config = filter(apiConfig, id);
            //console.log( 'config', config );
            return config;
        }
        function all() {
            //console.log( '-------- campaignModal all' );
            var datum = cache.all( getApiConfig(campaignID) );
            //console.log( 'datum', datum );
            var output = {
                'impressions': 0,
                'placements': 0
            };

            if (datum.length) {
                //console.log( 'datum loop' );
                ng.forEach(datum[0].all, function (d, key){
                    output[key] = d;
                });
            }
            //console.log( 'output', output );
            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            //console.log( 'observe' );
            return cache.observe(getApiConfig(), callback, $scope, preventImmediate);
        }

        function data(initialize) {
            //console.log( '------- data' );
            return cache.get(getApiConfig(), initialize);
        }

        var campaignID;

        function preview(id, row) {
            console.log( '------- Open Modal ', id );

            campaignID = id;

            var campaignData = cache.get(getApiConfig(id), true);
            //console.log( getApiConfig(id) );


            campaignData.observe(function() {
                var campaign = campaignData.all();
                console.log( 'campaign', campaign[0] );

                var campaignMetrics = campaign[0].metrics;
                console.log( 'campaignMetrics', campaignMetrics );
                
                if (!previewModals[id]) {
                    previewModals[id] = {
                        id: id,
                        name: row.campaign.name,
                        impressions: row.impressions.current,
                        // _getApiConfig: getApiConfig,
                        // _apiConfig: apiConfig,
                        // all: all,
                        // data: data,
                        // observe: observe
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
