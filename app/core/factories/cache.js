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
                    cache[url] = dataFactory(options.sortFn, { sync: options.sync, prepFn: options.prepFn });
                }

                if (initialize) {
                    cache[url].init(uriConfig, options.transform);
                }

                return cache[url];
            }

            function all(uriConfig){
                return get(uriConfig, true).all();
            }

            function exists(uriConfig) {
                var url = apiUriGenerator(uriConfig);
                return typeof cache[url] !== 'undefined';
            }

            function observe(uriConfig, callback, $scope, preventImmediate, preventInit) {
                get(uriConfig, !preventInit).observe(callback, $scope, preventImmediate);
            }

            function addData(uriConfig, newData) {
                get(uriConfig).addData(newData);
            }

            function isLoaded(uriConfig) {
                return get(uriConfig).isLoaded();
            }

            return {
                get: get,
                all: all,
                addData: addData,
                isLoaded: isLoaded,
                exists: exists,
                observe: observe
            };
        };
    }]);
});
