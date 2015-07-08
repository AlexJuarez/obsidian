define(function (require) {
    'use strict';

    var module = require('./../../module');
    var baseUrl = '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive';

    module.service('campaignsHeader', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.campaignSet;
            }
        });

        function idFilter() {
            var filters = [];
            var params = $state.params;

            if (params.accountId) {
                filters.push('account.id:eq:' + params.accountId);
            } else if (params.divisionId) {
                filters.push('division.id:eq:' + params.divisionId);
            } else if (params.clientId) {
                filters.push('client.id:eq:' + params.clientId);
            }


            if (filters.length) {
                return '&filters=' + filters.join(',');
            }

            return '';
        }

        function url() {
            return baseUrl + idFilter();
        }

        function all() {
            var datum = cache.all(url());
            var output = {
                'preFlight': 0,
                'inFlight': 0,
                'completed': 0,
                'archived': 0
            };

            for (var i = 0; i < datum.length; i++) {
                var data = datum[i];
                output[data.status] = data.metrics.count;
            }

            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(url(), callback, $scope, preventImmediate);
        }

        function data() {
            return cache.get(url(), true);
        }

        return {
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
