define(function (require) {
    'use strict';

    var module = require('./../module');
    var ng = require('angular');
    var baseUrl = '/api/v3/divisionSet?metrics=countAccounts,countCampaignsPreFlight,countCampaignsInFlight,countCampaignsCompleted,countCampaignsArchived,count';

    module.service('clientSet', ['cacheFactory', '$state', function (cacheFactory, $state) {
        var cache = cacheFactory({
            transform: function (data) {
                return data.divisionSet;
            }
        });

        function filter() {
            var output = '';

            if ($state.params.divisionId) {
                output = '&filters=id:eq:' + $state.params.divisionId;
            } else if ($state.params.clientId) {
                output = '&filters=client.id:eq:' + $state.params.clientId;
            }

            return output;
        }

        function url() {
            return baseUrl + filter();
        }

        function all() {
            var datum = cache.all(url());
            var output = {
                'count': 0,
                'countCampaignsPreFlight': 0,
                'countCampaignsInFlight': 0,
                'countCampaigns': 0,
                'countAccounts': 0,
                'countCampaignsArchived': 0,
                'countCampaignsCompleted': 0
            };

            if (datum.length) {
                ng.forEach(datum[0].metrics, function (d, key){
                    output[key] = d;
                });
                output.countCampaigns = output.countCampaignsPreFlight + output.countCampaignsInFlight;
            }

            return output;
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(url(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            return cache.get(url(), initialize);
        }

        return {
            url: url,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
