define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');

    var apiConfig = {
        endpoint: 'divisionSet',
        queryParams: {
            metrics: [
                'countAccounts', 'countCampaignsPreFlight',
                'countCampaignsInFlight', 'countCampaignsCompleted',
                'countCampaignsArchived', 'count'
            ]
        }
    };

    module.service('divisionSet', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.divisionSet;
            }
        });

        function getApiConfig() {
            var newApiConfig = ng.copy(apiConfig);
            if ($state.params.divisionId) {
                ng.extend(newApiConfig.queryParams, {
                    filters: ['id:eq:' + $state.params.divisionId]
                });
            }
            return newApiConfig;
        }

        function all() {
            var datum = cache.all(getApiConfig());
            var output = {
                'count': 0,
                'countCampaignsPreFlight': 0,
                'countCampaignsInFlight': 0,
                'countCampaigns': 0,
                'countAccounts': 0,
                'countCampaignsArchived': 0,
                'countCampaignsCompleted': 0
            };

            if (datum && datum.length) {
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
