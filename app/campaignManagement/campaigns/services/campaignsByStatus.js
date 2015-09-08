define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');

    var apiConfig = {
        endpoint: 'campaigns',
        queryParams: {
            dimensions: [
                'id', 'name', 'startDate', 'endDate', 'budget', 'account.id',
                'account.name', 'live', 'spend', 'anyPlacementsInBanner',
                'anyPlacementsDisplay', 'anyPlacementsInStream',
                'anyPlacementsRichMedia'
            ],
            metrics: [
                'countPlacements', 'countCreatives', 'impressions',
                'bookedImpressions'
            ],
            order: 'name:asc'
        }
    };

    var cache = {};

    var statuses = {
        'preFlight': 'Pre-Flight',
        'inFlight': 'In-Flight',
        'completed': 'Completed',
        'archived': 'Archived'
    };


    module.service('campaignsByStatus', ['campaignsHeader', 'campaignAccordionTableFactory', 'campaignsFilter', 'dataFactory', function (campaignsHeader, campaignAccordionTableFactory, campaignsFilter, dataFactory) {
        var filter = dataFactory();

        function tableConfig(status) {
            var config = ng.extend({}, apiConfig);
            config.queryParams.filters = campaignsFilter('status:eq:' + status);
            return config;
        }

        function init() {
            var accordionTables = cache[filterString()];

            if (!accordionTables) {
                accordionTables = cache[filterString()] = {};

                accordionTables.header = campaignsHeader.data(true);
                accordionTables.rows = {};

                ng.forEach(statuses, function(title, status) {
                    var accordionTable = campaignAccordionTableFactory();

                    accordionTable.init({
                        header: accordionTables.header,
                        title: title,
                        status: status,
                        rowsConfig: tableConfig(status)
                    });

                    accordionTables.rows[status] = accordionTable;
                });
            }
        }

        function setFilter(result) {
            filter.setData([result]);
        }

        function clearFilter() {
            filter.setData([]);
        }

        function filtered(result) {
            if (filter.all().length) {
                var filters = filter.all()[0];
                if(filters._type === 'campaign') {
                    return result.id === filters.id;
                } else {
                    return result.account.id === filters.id;
                }
            }

            return true;
        }

        function all() {
            init();

            var output = [];

            ng.forEach(cache[filterString()].rows, function (table) {
                output.push(table.all(filtered));
            });

            return output;
        }

        function observe(callback, $scope){
            init();

            filter.observe(callback, $scope);
            ng.forEach(cache[filterString()].rows, function (table) {
                table.observe(callback, $scope);
            });
        }

        function filterString() {
            return JSON.stringify(campaignsFilter());
        }

        return {
            _apiConfig: apiConfig,
            all: all,
            observe: observe,
            clearFilter: clearFilter,
            setFilter: setFilter
        };
    }]);
});
