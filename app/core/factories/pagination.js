define(function (require) {
    'use strict';

    var ng = require('angular');
    var module = require('./../module');

    module.factory('paginationFactory', ['$http', 'dataFactory', 'apiUriGenerator', function ($http, dataFactory, apiUriGenerator) {
        function buildConfig(config, limit, offset) {
            config.queryParams = config.queryParams || {};

            config.queryParams.limit = limit;
            config.queryParams.offset = offset;

            return config;
        }

        /**
         * Create a Pagination Factory Object
         * @param {function} sortFn - Optional sorting function, the data is stored after the sortFn is applied
         * @param {number} [limit=10] - Limit the number of results
         * @param {number} [offset=0] - The starting offset usually should not need to be changed.
         * @returns {{init: init, observe: (function), nextPage: nextPage, buildUrl: buildConfig, limit: (number), all: (Object[])}}
         */

        function create(sortFn, limit, offset) {
            limit = limit || 10;
            offset = offset || 0;

            var data = dataFactory(sortFn);
            var transform;
            var initialApiConfig;

            function init(apiConfig, transformFn, perPage) {
                initialApiConfig = ng.copy(apiConfig);
                transform = transformFn || function (d) { return d; };
                limit = perPage || 10;
                return data.init(buildConfig(initialApiConfig, limit, offset), transformFn);
            }

            function nextPage() {
                offset = offset + limit;
                var config = buildConfig(initialApiConfig, limit, offset);
                var url = apiUriGenerator(config);
                $http.get(url).success(function (res) {
                    data.addData(transform(res));
                });
            }

            return {
                init: init,
                observe: data.observe,
                filtered: data.filtered,
                notifyObservers: data.notifyObservers,
                nextPage: nextPage,
                _buildConfig: buildConfig,
                limit: limit,
                all: data.all
            };
        }

        return create;
    }]);


});
