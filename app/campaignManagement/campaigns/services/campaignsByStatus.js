define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var headerBaseUrl = '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive';
    var tableBaseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions';
    var cache = {};

    var statuses = {
        'preFlight': 'Pre-Flight',
        'inFlight': 'In-Flight',
        'completed': 'Completed',
        'archived': 'Archived'
    };

    module.service('campaignsByStatus', ['dataFactory', 'campaignAccordionTableFactory', '$state', function (data, campaignAccordionTableFactory, $state) {
        function idFilter(opt) {
            var filter = '';
            var params = $state.params;

            if (params.accountId) {
                filter = 'account.id:eq:' + params.accountId + ',';
            } else if (params.divisionId) {
                filter = 'division.id:eq:' + params.divisionId + ',';
            } else if (params.clientId) {
                filter = 'client.id:eq:' + params.clientId + ',';
            }

            if (filter || opt) {
                return '&filters=' + filter + opt;
            }

            return '';
        }

        function headerUrl() {
            return headerBaseUrl + idFilter();
        }

        function tableUrl(status) {
            return tableBaseUrl + idFilter('status:eq:' + status );
        }

        function transformHeader(data) {
            var output = [];
            var metrics;

            for (var i = 0; i < data.campaignSet.length; i++) {
                metrics = data.campaignSet[i];
                output.push({
                    status: metrics.status,
                    count: metrics.metrics.count,
                    hasLive: metrics.metrics.countLive > 0
                });
            }
            return output;
        }

        function init() {
            var accordionTables = cache[idFilter()];

            if (!accordionTables) {
                accordionTables = cache[idFilter()] = {};

                accordionTables.header = data(transformHeader);
                accordionTables.header.init(headerUrl());
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
