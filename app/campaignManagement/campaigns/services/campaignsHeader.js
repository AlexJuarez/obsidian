define(function (require) {
    'use strict';

    var module = require('./../../module');
    var baseUrl = '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive';

    module.service('campaignsHeader', ['cacheFactory', 'campaignsFilter', function (cacheFactory, filter) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.campaignSet;
            }
        });

        function url() {
            return baseUrl + filter();
        }

        function all() {
            var datum = cache.all(url());
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
            return cache.observe(url(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            return cache.get(url(), initialize);
        }

        return {
            url: url,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
