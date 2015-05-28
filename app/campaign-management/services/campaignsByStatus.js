define(function (require) {
    'use strict';

    var module = require('./../module');

    module.service('campaignsByStatus', [ '$http', 'paginationFactory', 'dataFactory', function ($http, paginationFactory, dataFactory) {
        var header = dataFactory();
        var campaigns = paginationFactory(sortCampaigns);

        function sortCampaigns(transformedCampaigns) {
            var sortFn = function (a, b) {
                if (a.name && b.name) {
                    if (a.name > b.name) {
                        return -1;
                    }
                    if (a.name < b.name) {
                        return 1;
                    }
                }
                return 0;
            };

            transformedCampaigns.data.sort(sortFn);
            return transformedCampaigns;
        }

        function init(urls) {
            if (urls.campaigns) {
                campaigns.init(urls.campaigns, transformCampaigns);
            }
            if (urls.header) {
                header.init(urls.header, transformHeader);
            }
        }

        function transformCampaigns(data) {
            var campaigns = data.campaigns;

            return campaigns;
        }

        function transformHeader(data) {
            var campaignSet = data.campaignSet[0];
            return {
                status: campaignSet.status,
                count: campaignSet.metrics.count,
                hasLive: campaignSet.metrics.countLive > 0
            };
        }

        campaigns.observe(observeCampaigns);

        function observeCampaigns(callback) {
            callback();
        }

        function getTable() {
            var header = header.all();
            var campaigns = campaigns.all();
            return [
                {
                    header: getTableHeader(header),
                    content: {
                        rules: {
                            account: '',
                            name: '',
                            impressions: 'bullet',
                            start: 'date',
                            end: 'date',
                            placements: 'number',
                            creatives: 'number',
                            edit: ''
                        },
                        headers: [
                            {name: 'Account', id: 'account'},
                            {name: 'Campaign', id: 'campaign'},
                            {name: 'Impressions & Pacing', id: 'impressions'},
                            {name: 'Start', id: 'start'},
                            {name: 'End', id: 'end'},
                            {name: 'Placements', id: 'placements'},
                            {name: 'Creatives', id: 'creatives'},
                            {name: 'Edit', id: 'edit'}
                        ],
                        data: campaigns
                    }
                }
            ];
        }

        function getTableHeader(data) {
            var hasLiveHeaderClass = data.hasLive ?
                'success' :
                '';
            return '<span class="icon-status' +
                hasLiveHeaderClass + '></span> ' +
                data.status + ' (' + data.count + ')';
        }

        return {
            init: init,
            observe: observeCampaigns,
            all: getTable
        };
    }]);
});
