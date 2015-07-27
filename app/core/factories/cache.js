define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('cacheFactory', ['dataFactory', 'apiUriGenerator', function (dataFactory, apiUriGenerator) {
        /**
         * Creates a cacheFactory object that wraps a dataFactory
         * @param {{sortFn: (function), transform: (function)}}
         * @returns {{get: get, all: all, observe: observe}}
         */
        return function(options) {
            var cache = {};
            options = options || {};

            function get(uriConfig, initialize) {
                var url = apiUriGenerator(uriConfig);
                if (!cache[url]) {
                    cache[url] = dataFactory(options.sortFn);
                }

                if (initialize) {
                    cache[url].init(uriConfig, options.transform);
                }

                return cache[url];
            }

            function all(uriConfig){
                return get(uriConfig, true).all();
            }

            function observe(uriConfig, callback, $scope, preventImmediate) {
                get(uriConfig, true).observe(callback, $scope, preventImmediate);
            }

            return {
                get: get,
                all: all,
                observe: observe
            };
        };
    }]);
});
