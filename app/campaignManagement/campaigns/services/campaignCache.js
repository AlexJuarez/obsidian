define(function (require) {
    'use strict';

    var module = require('./../../module');
    var cache = {};

    module.service('campaignCache', ['paginationFactory', function (paginationFactory) {
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

        return {
            get: get
        };
    }]);
});
