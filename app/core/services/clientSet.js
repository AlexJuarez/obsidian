define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');
    var apiConfig = {
        endpoint: 'clientSet',
        queryParams: {
            metrics: [
                'countAccounts', 'countDivisions', 'countCampaignsPreFlight',
                'countCampaignsInFlight', 'countCampaignsCompleted',
                'countCampaignsArchived', 'count'
            ]
        }
    };

    module.service('clientSet', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({

            transform: function (data) {
                return data.clientSet;
            }
        });

        function filter(config) {
            var newConfig = ng.copy(config);
            if ($state.params.clientId) {
                newConfig.queryParams.filters = ['id:eq:' + $state.params.clientId];
            }
            return newConfig;
        }

        function getApiConfig() {
            return filter(apiConfig);
        }

        function all() {
            var datum = cache.all(getApiConfig());
            var output = {
                'count': 0,
                'countCampaignsPreFlight': 0,
                'countCampaignsInFlight': 0,
                'countCampaigns': 0,
                'countAccounts': 0,
                'countDivisions': 0,
                'countCampaignsArchived': 0,
                'countCampaignsCompleted': 0
            };

            if (datum.length) {
                ng.forEach(datum[0].metrics, function (d, key){
                    output[key] = d;
                });
                output.countCampaigns = output.countCampaignsPreFlight + output.countCampaignsInFlight;
            }

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
            return cache.get(getApiConfig(), initialize);
        }

        return {
            _getApiConfig: getApiConfig,
            _apiConfig: apiConfig,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
