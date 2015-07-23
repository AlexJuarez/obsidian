define(function (require) {
    'use strict';

    var module = require('./../../module');

    var ng = require('angular');

    var apiConfig = {
        endpoint: 'campaignSet',
        dimensions: ['status'],
        metrics: ['count', 'countPlacementsLive']
    };

    module.service('campaignsHeader', ['cacheFactory', 'campaignsFilter', function (cacheFactory, filter) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.campaignSet;
            }
        });

        function getApiUriConfig() {
            return ng.extend(filter(), apiConfig);
        }

        function all() {
            var datum = cache.all(getApiUriConfig());
            var output = {
                'preFlight': 0,
                'inFlight': 0,
                'completed': 0,
                'archived': 0
            };

            for (var i = 0; i < datum.length; i++) {
                var data = datum[i];
                output[data.status] = data.metrics.count;
            }

            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(getApiUriConfig(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            return cache.get(getApiUriConfig(), initialize);
        }

        return {
            _apiConfig: apiConfig,
            _getApiUriConfig: getApiUriConfig,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
