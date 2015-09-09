define(function(require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    var apiConfig = {
        endpoint: 'campaigns',
        queryParams: {
            dimensions: [
                'status', 'startDate', 'endDate',
                'distinctPublishers', 'countPlacements',
                'countCreatives', 'live'
            ],
            metrics: ['impressions', 'bookedImpressions']
        }
    };

    module.service('campaignDetailsService', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({
            transform: function(data) {
                return data.campaigns;
            }
        });

        function getApiConfig() {
            var config = ng.copy(apiConfig);
            if($state.params.campaignId){
                config.queryParams.filters = ['id:eq:' + $state.params.campaignId];
            }
            return config;
        }

        function get() {
            return cache.get(getApiConfig(), false);
        }

        function all() {
            return cache.all(getApiConfig());
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(getApiConfig(), callback, $scope, preventImmediate);
        }

        return {
            _getApiConfig: getApiConfig,
            all: all,
            observe: observe,
            get: get
        };
    }]);
});
