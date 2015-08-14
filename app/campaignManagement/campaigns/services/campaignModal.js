define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var apiConfig = {
        endpoint: 'campaigns',
        queryParams: {
            metrics: [
                'impressions',
                'placements'
            ]
        }
    };

    var previewModals = {};
    var editModals = {};
    var createModal;

    module.service('campaignModal', ['$modal', '$state', 'cacheFactory', function ($modal, $state, cacheFactory) {
        
        var cache = cacheFactory({
            transform: function (data) {
                console.log( 'data.campaignModal', data.campaignModal );
                return data.campaignModal;
            }
        });

        //var campaignId;

        function filter(config) {
            console.log( '----- filter' );
            var newConfig = ng.extend({}, config);
            //console.log( '$state.params', $state.params );
            //if ($state.params.campaignId) {
                //console.log( 'campaignId', campaignId );
                newConfig.queryParams.filters = ['status:eq:inFlight'];
            //}
            console.log( 'newConfig', newConfig );
            return newConfig;
        }

        function getApiConfig() {
            console.log( '------- getApiConfig' );
            var config = filter(apiConfig);
            console.log( 'config', config );
            return config;
        }
        function all() {
            console.log( '-------- all' );
            var datum = cache.all(getApiConfig());
            console.log( 'datum', datum );
            var output = {
                'impressions': 0,
                'placements': 0
            };

            if (datum.length) {
                console.log( 'datum loop' );
                ng.forEach(datum[0].all, function (d, key){
                    output[key] = d;
                });
                //output.countCampaigns = output.countCampaignsPreFlight + output.countCampaignsInFlight;
            }
            console.log( 'output', output );
            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(getApiConfig(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            console.log( '------- data' );
            return cache.get(getApiConfig(), initialize);
        }

        function preview(id, row) {
            console.log( '------- preview ', id, row );

            //campaignId = id;


            if (!previewModals[id]) {
                previewModals[id] = {
                    id: id,
                    name: row.campaign.name,
                    impressions: row.impressions.current,
                    all: all()
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
