define(function (require) {
    'use strict';

    var module = require('./../../module');

    module.factory('campaignAccordionTableFactory', ['$http', '$q', '$interpolate', 'dataFactory', 'paginationFactory', function ($http, $q, $interpolate, dataFactory, paginationFactory) {
        return function() {
            var header = dataFactory();
            var rows = paginationFactory(sortRows);
            var status;
            var options = {
                more: rows.nextPage
            };

            function sortRows(transformedRows) {
                var sortFn = function (a, b) {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                };

                transformedRows.sort(sortFn);
                return transformedRows;
            }

            function init(data) {
                status = data.status;
                if (data.rows) {
                    rows.init(data.rows, transformRows);
                }
                if (data.header) {
                    header.init(data.header, transformHeader);
                }
            }

            function transformRows(data) {
                var rows = data.campaigns;
                var newRows = [];
                var row;

                for(var i=0; i<rows.length; i++) {
                    row = rows[i];
                    newRows.push({
                        id: row.id,
                        account: {
                            id: row.account.id,
                            route: 'cm.campaigns.all({ accountId: row.account.id })',
                            name: row.account.name
                        },
                        campaign: {
                            route: 'cm.campaigns.detail({ campaignId: row.id })',
                            name: row.name
                        },
                        impressions: {
                            target: row.metrics.bookedImpressions,
                            max: row.metrics.impressions
                        },
                        start: row.startDate,
                        end: row.endDate,
                        placements: row.metrics.countPlacements,
                        creatives: row.metrics.countCreatives
                    });
                }

                return newRows;
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

            function getTable() {
                return {
                    header: getTableHeader(header.all()),
                    options: options,
                    content: {
                        rules: {
                            account: 'link',
                            campaign: 'link',
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
                        data: rows.all()
                    }
                };
            }

            function getTableHeader(data) {
                var template;

                if (data && data[0]) {
                    var header = data[0];
                    template = $interpolate('<span class="icon-status [[hasLiveHeaderClass]]"></span>[[status]] ([[count]])');
                    return template({
                        status: header && header.status,
                        count: header && header.count,
                        hasLiveHeaderClass: header && header.hasLive ?
                            'success' :
                            ''
                    });
                } else {
                    template = $interpolate('<span class="icon-status"></span>[[status]] (0)');
                    return template({
                        status: status
                    });
                }
            }

            function observe(callback, $scope) {
                header.observe(callback, $scope);
                rows.observe(callback, $scope);
            }

            return {
                init: init,
                observe: observe,
                all: getTable
            };
        };
    }]);
});
