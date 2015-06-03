define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var accordionTables = {};

    module.service('campaignsByStatus', ['$http', 'campaignAccordionTableFactory', function ($http, campaignAccordionTableFactory) {

        var headerBaseUrl = '/narwhal/campaignSet?dimensions=status&metrics=count,countPlacementsLive&filters=status:eq:';
        var rowsBaseUrl = '/narwhal/campaigns?dimensions=id,name,startDate,endDate,budget&metrics=bookedImpressions,countPlacements,countCreatives,impressions,spend&filters=status:eq:';

        var statuses = {
            'Pre-Flight': 'preFlight',
            'In-Flight': 'inFlight',
            'Completed': 'completed',
            'Archived': 'archived'
        };

        for(var status in statuses) {
            var accordionTable = campaignAccordionTableFactory();
            accordionTable.init({
                status: status,
                rows: rowsBaseUrl + status,
                header: headerBaseUrl + status
            });

            accordionTables[statuses[status]] = accordionTable;
        }

        function all() {
            var output = [];

            for(var table in accordionTables) {
                output.push(accordionTables[table].all());
            }

            return output;
        }

        function observe(callback, $scope){
            ng.forEach(accordionTables, function (table) {
                table.observe(callback, $scope);
            });
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
