define(function (require) {
    'use strict';

    var module = require( './../module' );

    module.service('$http', 'paginationFactory', 'dataFactory', function($http, paginationFactory, dataFactory) {
        var header = dataFactory();

        var statusTypes = ['Pre-Flight', 'In-Flight', 'Complete', 'Archived'];
        var campaigns = {};
        statusTypes.forEach(function(status) {
           campaigns[status] = paginationFactory(sortCampaigns);
        });

        function sortCampaigns(transformedCampaigns) {
            var sortFn = function(a, b) {
                if (a.name && b.name) {
                    if (a.name > b.name) { return -1; }
                    if (a.name < b.name) { return 1; }
                }
                return 0;
            }

            transformedCampaigns.data.sort(sortFn);
            return transformedCampaigns;
        }

        function init(urls) {
            for (var status in campaigns) {
                if (urls[status]) {
                    campaigns[status].init(urls[status], transformCampaigns);
                }
            }

            if (urls.header) {
                header.init(urls.header, transformHeader);
            }
        }

        function transformCampaigns(data) {
            return data.campaigns;
        }

        function transformHeader(data) {
            var campaignSet = data.campaignSet;
            var outData = {};
            campaignSet.forEach(function(campaign) {
               outData[campaign.status] = {
                   count: campaign.metrics.count,
                   hasLive: campaign.metrics.countLive > 0
               };
            });

            return outData;
        }

        for (var status in campaigns) {
            campaigns[status].observe(observeAll);
        }

        function observeAll(callback) {
            callback();
        }

        function getTables() {
            for (var status in campaigns) {
                getTable(status);
            }
        }

        function getTable(status) {
            var header = header[]
        }

        return {
            init: init,
            observe: observeAll,
            all: getTables
        };
    });
});
