define(function (require) {
   'use strict';

    var module = require('./../module');
    var ng = require('angular');

    ///api/v2/analytics/data?&metrics=impression,view,videoSeconds,userAction,clickthrough,averagePercentComplete&dimensions=weekStarting&filters=clientId%3Aeq%3A3a9ad769-b533-4fea-94c9-b4d41a8abc2b&order=weekStarting.asc

    var apiConfig = {
        version: 'v2/analytics',
        endpoint: 'data',
        queryParams: {
            metrics: [
                'impression', 'view', 'videoSeconds',
                'userAction', 'clickthrough', 'averagePercentComplete'
            ]
        }
    };

    module.service('analyticsChartService', ['cacheFactory', '$state', function(cacheFactory, $state) {
        var cache = cacheFactory();

        function _apiConfig(interval, startDate) {
            var newConfig = ng.merge(apiConfig , {
                queryParams: {
                    dimensions: [interval],
                    order: interval + '.asc'
                }
            });

            if (startDate) {
                newConfig.queryParams.startDate = startDate;
            }

            if ($state.params.clientId) {
                newConfig.queryParams.filters = ['clientId:eq:' + $state.params.clientId];
            }

            return newConfig;
        }

        function get(interval, startDate) {
            return cache.get(_apiConfig(interval, startDate), true);
        }

        function exists(interval, startDate) {
            return cache.exists(_apiConfig(interval, startDate));
        }

        return {
            get: get,
            exists: exists
        };

    }]);
});
