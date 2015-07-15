define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');
    var baseUrl = '/fixtures/campaignCreative.json';

    module.service('campaignCreative', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.campaignCreatives;
            }
        });

        function filter() {
            var output = '';

            if ($state.params.clientId) {
                output = '&filters=id:eq:' + $state.params.clientId;
            }

            return output;
        }

        function url() {
            return baseUrl + filter();
        }

        function all() {
            var datum = cache.all(url());
            var output = [];

            if (datum.length) {
                ng.forEach(datum, function (d, key){
                    output[key] = d;
                });
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
