define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var tableBaseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&order=name:asc';
    var cache = {};

    var statuses = {
        'preFlight': 'Pre-Flight',
        'inFlight': 'In-Flight',
        'completed': 'Completed',
        'archived': 'Archived'
    };

    module.service('campaignsByStatus', ['campaignsHeader', 'campaignAccordionTableFactory', 'campaignsFilter', function (campaignsHeader, campaignAccordionTableFactory, filter) {
        function tableUrl(status) {
            return tableBaseUrl + filter('status:eq:' + status );
        }

        function init() {
            var accordionTables = cache[filter()];

            if (!accordionTables) {
                accordionTables = cache[filter()] = {};

                accordionTables.header = campaignsHeader.data(true);
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

            ng.forEach(cache[filter()].rows, function (table) {
                output.push(table.all());
            });

            return output;
        }

        function observe(callback, $scope){
            init();

            ng.forEach(cache[filter()].rows, function (table) {
                table.observe(callback, $scope);
            });
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
