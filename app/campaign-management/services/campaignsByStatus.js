define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('campaignsByStatus', [ '$http', 'campaignAccordionTableFactory', function ($http, campaignAccordionTableFactory) {

        var headerBaseUrl = 'campaignSet?dimensions=status&metrics=count,countLive&filters=status:eq:';
        var rowsBaseUrl = 'campaigns?dimensions=id,name,startDate,endDate,budget&metrics=bookedImpressions,countPlacements,countCreatives,impressions,spend&filters=status:eq:';
        var statuses = ['Pre-Flight', 'In-Flight', 'Completed', 'Archived'];
        var accordionTables = {};
        statuses.forEach(function(status) {
            accordionTables[status] = campaignAccordionTableFactory();
            accordionTables[status].init({
                rows: rowsBaseUrl + status,
                header: headerBaseUrl + status
            });
        });
    }]);
});
