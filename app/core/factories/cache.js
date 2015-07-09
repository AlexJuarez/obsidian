define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('cacheFactory', ['dataFactory', function (dataFactory) {
        /**
         * Creates a cacheFactory object that wraps a dataFactory
         * @param {{sortFn: (function), transform: (function)}}
         * @returns {{get: get, all: all, observe: observe}}
         */
        return function(options) {
            var cache = {};
            options = options || {};

            function get(url, initialize) {
                if (!cache[url]) {
                    cache[url] = dataFactory(options.sortFn);
                }

                if (initialize) {
                    cache[url].init(url, options.transform);
                }

                return cache[url];
            }

            function all(url){
                return get(url, true).all();
            }

            function observe(url, callback, $scope, preventImmediate) {
                get(url, true).observe(callback, $scope, preventImmediate);
            }

            return {
                get: get,
                all: all,
                observe: observe
            };
        };
    }]);
});
