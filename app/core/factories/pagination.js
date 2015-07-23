define(function (require) {
    'use strict';

    var ng = require('angular');
    var module = require('./../module');

    module.factory('paginationFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
        function buildPageUrl(config, limit, offset) {
            ng.extend(config, {
                limit: limit,
                offset: offset
            });
            return config;
        }

        /**
         * Create a Pagination Factory Object
         * @param {function} sortFn - Optional sorting function, the data is stored after the sortFn is applied
         * @param {number} [limit=10] - Limit the number of results
         * @param {number} [offset=0] - The starting offset usually should not need to be changed.
         * @returns {{init: init, observe: (function), nextPage: nextPage, buildUrl: buildPageUrl, limit: (number), all: (Object[])}}
         */

        function create(sortFn, limit, offset) {
            limit = limit || 10;
            offset = offset || 0;

            var data = dataFactory(sortFn);
            var baseUrl = '';
            var transform;

            function init(apiConfig, transformFn, perPage) {
                transform = transformFn || function (d) { return d; };
                limit = perPage || 10;
                data.init(buildPageUrl(apiConfig, limit, offset), transformFn);
            }

            function nextPage() {
                offset = offset + limit;
                $http.get(buildPageUrl(baseUrl, limit, offset)).success(function (res) {
                    data.addData(transform(res));
                });
            }

            return {
                init: init,
                observe: data.observe,
                filtered: data.filtered,
                notifyObservers: data.notifyObservers,
                nextPage: nextPage,
                buildUrl: buildPageUrl,
                limit: limit,
                all: data.all
            };
        }

        return create;
    }]);


});
