define(function (require) {
    'use strict';

    var module = require('./../../module');
    var ng = require('angular');
    var accordionTables = {};

    module.service('campaignsByStatus', ['$http', 'campaignAccordionTableFactory', function ($http, campaignAccordionTableFactory) {

        var headerBaseUrl = '/api/v3/campaignSet?dimensions=status&metrics=count,countPlacementsLive&filters=status:eq:';
        var rowsBaseUrl = '/api/v3/campaigns?dimensions=id,name,startDate,endDate,budget,account.id,account.name&metrics=countPlacements,countCreatives,impressions,bookedImpressions&filters=status:eq:';

        var statuses = {
            'preFlight': 'Pre-Flight',
            'inFlight': 'In-Flight',
            'completed': 'Completed',
            'archived': 'Archived'
        };

        ng.forEach(statuses, function(title, status) {
            var accordionTable = campaignAccordionTableFactory();
            accordionTable.init({
                status: title,
                rows: rowsBaseUrl + status,
                header: headerBaseUrl + status
            });

            accordionTables[status] = accordionTable;
        });

        function all() {
            var output = [];

            ng.forEach(accordionTables, function (table) {
                output.push(table.all());
            });

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
