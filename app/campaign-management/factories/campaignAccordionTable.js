define(function (require) {
    'use strict';

    var module = require('./../module');

    module.factory('campaignAccordionTableFactory', ['$http', '$interpolate', 'dataFactory', 'paginationFactory', function ($http, $interpolate, dataFactory, paginationFactory) {
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
                }

                transformedRows.data.sort(sortFn);
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

                return rows;
            }

            function transformHeader(data) {
                var campaignSet = data.campaignSet[0];
                return {
                    status: campaignSet.status,
                    count: campaignSet.metrics.count,
                    hasLive: campaignSet.metrics.countLive > 0
                };
            }

            rows.observe(observeRows);

            function observeRows(callback) {
                callback();
            }

            function getTable() {
                var header = header.all();
                var rows = rows.all();
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
                            data: rows
                        }
                    }
                ];
            }

            function getTableHeader(data) {

                var template = $interpolate('<span class="icon-status {{hasLiveHeaderClass}}"></span>{{status}} ({{count}})')

                return template({
                    status: data.status,
                    count: data.count,
                    hasLiveHeaderClass: data.hasLive ?
                        'success' :
                        ''
                });
            }

            return {
                init: init,
                observe: observeRows,
                all: getTable
            };
        };
    }]);
});
