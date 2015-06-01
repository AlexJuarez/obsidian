define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('campaignAccordionTableFactory', ['$http', '$q', '$interpolate', 'dataFactory', 'paginationFactory', function ($http, $q, $interpolate, dataFactory, paginationFactory) {
        return function() {
            var header = dataFactory();
            var rows = paginationFactory(sortRows);

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

            function init(urls) {
                if (urls.rows) {
                    rows.init(urls.rows, transformRows);
                }
                if (urls.header) {
                    header.init(urls.header, transformHeader);
                }
            }

            function transformRows(data) {
                var rows = data.campaigns;
                var newRows = [];
                var row;

                for(var i=0; i<rows.length; i++) {
                    row = rows[i];
                    newRows.push({
                        account: row.account.name,
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
                var campaignSet = data.campaignSet[0];
                return [{
                    status: campaignSet.status,
                    count: campaignSet.metrics.count,
                    hasLive: campaignSet.metrics.countLive > 0
                }];
            }

            function getTable() {
                return [
                    {
                        header: getTableHeader(header.all()),
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
                            data: rows.all()
                        }
                    }
                ];
            }

            function getTableHeader(data) {
                var header = data[0];
                var template = $interpolate('<span class="icon-status [[hasLiveHeaderClass]]"></span>[[status]] ([[count]])');
                return template({
                    status: header.status,
                    count: header.count,
                    hasLiveHeaderClass: header.hasLive ?
                        'success' :
                        ''
                });
            }

            var headerReady = $q.defer();
            var rowsReady = $q.defer();

            header.observe(function() {
                if (headerReady) {
                    headerReady.resolve();
                    headerReady = false;
                }
            }, undefined, true);
            rows.observe(function() {
                if (rowsReady) {
                    rowsReady.resolve();
                    rowsReady = false;
                }
            }, undefined, true);


            return {
                init: init,
                allReady: $q.all([headerReady.promise, rowsReady.promise]),
                observeRows: rows.observe,
                getMoreCampaigns: rows.addPage,
                all: getTable
            };
        };
    }]);
});
