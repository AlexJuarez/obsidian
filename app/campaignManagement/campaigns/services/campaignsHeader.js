define(function (require) {
    'use strict';

    var module = require('./../../module');

    var ng = require('angular');

    var apiConfig = {
        endpoint: 'campaignSet',
        queryParams: {
            dimensions: ['status'],
            metrics: ['count', 'countPlacementsLive']
        }
    };

    module.service('campaignsHeader', ['cacheFactory', 'campaignsFilter', function (cacheFactory, filter) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.campaignSet;
            }
        });

        function getApiUriConfig() {
            var newConfig = {};
            ng.extend(newConfig, apiConfig);
            newConfig.queryParams.filters = filter();
            return newConfig;
        }

        function all() {
            var datum = cache.all(getApiUriConfig());
            var output = {
                'preFlight': 0,
                'inFlight': 0,
                'completed': 0,
                'archived': 0
            };

            if (datum && datum.length) {
                for (var i = 0; i < datum.length; i++) {
                    var data = datum[i];
                    output[data.status] = data.metrics.count;
                }
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

        function noContent() {
            var datas = all();
            var results = [];
            ng.forEach(datas, function(d) {
                results.push(d === 0);
            });

            return results.every(function (d) {
                return d;
            });
        }

        return {
            _apiConfig: apiConfig,
            _getApiUriConfig: getApiUriConfig,
            all: all,
            data: data,
            observe: observe,
            noContent: noContent
        };
    }]);
});
