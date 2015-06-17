define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('paginationFactory', ['$http', 'dataFactory', function ($http, dataFactory) {
        function buildPageUrl(url, limit, offset) {
            if (url.indexOf('?') > -1) {
                return url + '&limit=' + limit + '&offset=' + offset;
            } else {
                return url + '?limit=' + limit + '&offset=' + offset;
            }
        }

        return function (sortFn) {
            var limit = 10;
            var offset = 0;
            var data = dataFactory(sortFn);
            var baseUrl = '';
            var transform;

            function init(url, transformFn, perPage) {
                baseUrl = url;
                transform = transformFn || function (d) { return d; };
                limit = perPage || 10;
                data.init(buildPageUrl(baseUrl, limit, offset), transformFn);
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
                nextPage: nextPage,
                buildUrl: buildPageUrl,
                limit: limit,
                all: data.all
            };
        };
    }]);


});
