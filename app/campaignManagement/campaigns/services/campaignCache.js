define(function (require) {
    'use strict';

    var module = require('./../../module');
    var cache = {};

    module.service('campaignCache', ['paginationFactory', function (paginationFactory) {
        var limit = 10;

        function createCache(url, transform) {
            var paginate = paginationFactory();
            paginate.init(url, transform);
            return paginate;
        }

        function get(url, transform) {
            if (!cache[url]) {
                cache[url] = createCache(url, transform);
            }

            return cache[url];
        }

        //TODO: manage the destroyed artifacts... Currently the items removed can persist in memory via external references
        function clear() {
            cache = {};
        }

        return {
            get: get,
            limit: limit,
            clear: clear
        };
    }]);
});
