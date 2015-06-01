define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('campaignsByStatus', [ '$http', 'campaignAccordionTableFactory', function ($http, campaignAccordionTableFactory) {

        //var headerBaseUrl = '/narwhal/campaignSet?dimensions=status&metrics=count,countLive&filters=status:eq:';
        //var rowsBaseUrl = '/narwhal/campaigns?dimensions=id,name,startDate,endDate,budget&metrics=bookedImpressions,countPlacements,countCreatives,impressions,spend&filters=status:eq:';
        var headerBaseUrl = '/fixtures/campaignTables/byStatus/header';
        var rowsBaseUrl = '/fixtures/campaignTables/byStatus/';
        var statuses = {
            //'Pre-Flight': 'preFlight',
            'In-Flight': 'inFlight'
            //'Completed': 'completed',
            //'Archived': 'archived'
        };
        var accordionTables = {};

        for( var status in statuses ) {
            var accordionTable = campaignAccordionTableFactory();
            accordionTable.init({
                rows: rowsBaseUrl + status + '.json',
                header: headerBaseUrl + status + '.json'
            });

            accordionTables[statuses[status]] = {
                allReady: accordionTable.allReady,
                observeRows: accordionTable.observeRows,
                getMoreCampaigns: accordionTable.getMoreCampaigns,
                all: accordionTable.all
            };
        }

        return accordionTables;
    }]);
});
