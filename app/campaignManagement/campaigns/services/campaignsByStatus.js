define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var tableBaseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions';
    var cache = {};

    var statuses = {
        'preFlight': 'Pre-Flight',
        'inFlight': 'In-Flight',
        'completed': 'Completed',
        'archived': 'Archived'
    };

    module.service('campaignsByStatus', ['campaignsHeader', 'campaignAccordionTableFactory', '$state', function (campaignsHeader, campaignAccordionTableFactory, $state) {
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
                return '&filters=' + filters.join(',');
            }

            return '';
        }

        function tableUrl(status) {
            return tableBaseUrl + idFilter('status:eq:' + status );
        }

        function init() {
            var accordionTables = cache[idFilter()];

            if (!accordionTables) {
                accordionTables = cache[idFilter()] = {};

                accordionTables.header = campaignsHeader.data();
                accordionTables.rows = {};

                ng.forEach(statuses, function(title, status) {
                    var accordionTable = campaignAccordionTableFactory();

                    accordionTable.init({
                        header: accordionTables.header,
                        title: title,
                        status: status,
                        rows: tableUrl(status)
                    });

                    accordionTables.rows[status] = accordionTable;
                });
            }
        }


        function all() {
            init();

            var output = [];

            ng.forEach(cache[idFilter()].rows, function (table) {
                output.push(table.all());
            });

            return output;
        }

        function observe(callback, $scope){
            init();

            ng.forEach(cache[idFilter()].rows, function (table) {
                table.observe(callback, $scope);
            });
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
