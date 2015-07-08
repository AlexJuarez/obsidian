define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('cacheFactory', ['dataFactory', function (dataFactory) {
        return function(options) {
            var cache = {};

            function get(url, initialize) {
                if (!cache[url]) {
                    cache[url] = dataFactory(options.sortFn);
                    if (initialize) {
                        cache[url].init(url, options.transform);
                    }
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
