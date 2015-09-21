define(function (require) {
   'use strict';

    var module = require('./../module');
    var ng = require('angular');

    ///api/v2/analytics/data?&metrics=impression,view,videoSeconds,userAction,clickthrough,averagePercentComplete&dimensions=weekStarting&filters=clientId%3Aeq%3A3a9ad769-b533-4fea-94c9-b4d41a8abc2b&order=weekStarting.asc

    var filters = ['clientId', 'divisionId', 'accountId', 'campaignId'];

    module.service('analyticsChartService', ['cacheFactory', '$state', '$filter', function(cacheFactory, $state, $filter) {
        var cache = cacheFactory();

        function addFilters(config, filter) {
            if($state.params[filter]) {
                config.queryParams.filters = [filter + ':eq:' + $state.params[filter]];
            }
        }

        function _apiConfig(interval, startDate) {
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

            var newConfig = ng.merge(apiConfig , {
                queryParams: {
                    dimensions: [interval],
                    order: interval + '.asc'
                }
            });

            if (startDate) {
                newConfig.queryParams.startDate = $filter('date')(startDate, 'yyyy-MM-dd');
            }

            ng.forEach(filters, function (v) {
                addFilters(newConfig, v);
            });

            return newConfig;
        }

        function get(interval, startDate) {
            return cache.get(_apiConfig(interval, startDate), true);
        }

        function exists(interval, startDate) {
            return cache.exists(_apiConfig(interval, startDate));
        }

        return {
            _apiConfig: _apiConfig,
            get: get,
            exists: exists
        };

    }]);
});
