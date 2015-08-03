define(function (require) {
    'use strict';

    var module = require('./../../module');
    var cache = {};

    module.service('campaignCache', ['paginationFactory', 'apiUriGenerator', function (paginationFactory, apiUriGenerator) {
        function createCache(apiConfig, transform) {
            var paginate = paginationFactory();
            paginate.init(apiConfig, transform);
            return paginate;
        }

        function get(apiConfig, transform) {
            var url = apiUriGenerator(apiConfig);
            if (!cache[url]) {
                cache[url] = createCache(apiConfig, transform);
            }

            return cache[url];
        }

        return {
            get: get
        };
    }]);
});
