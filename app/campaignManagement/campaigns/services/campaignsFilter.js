define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.service('campaignsFilter', ['$state', function ($state) {
        /**
         * Constructs an idFilter string of the form &filters=filter1,filter2,filter3
         * @param {string} opt - Optional string that contains additional filters
         * @returns {string}
         */
        function idFilter(opt) {
            var filters = [];
            var params = $state.params;

            if (params.accountId) {
                filters.push('account.id:eq:' + params.accountId);
            } else if (params.divisionId) {
                filters.push('division.id:eq:' + params.divisionId);
            } else if (params.clientId) {
                filters.push('client.id:eq:' + params.clientId);
            }

            if (opt) {
                filters.push(opt);
            }

            if (filters.length) {
                return {
                    filters: filters
                };
            }

            return {};
        }

        return idFilter;
    }]);
});
