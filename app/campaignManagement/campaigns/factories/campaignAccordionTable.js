define(function (require) {
    'use strict';

    var module = require('./../../module');
    var headerTemplate = require('tpl!./../campaignsByStatusHeader.html');

    module.factory('campaignAccordionTableFactory', ['$http', '$interpolate', 'dataFactory', 'paginationFactory', '$state', function ($http, $interpolate, dataFactory, paginationFactory, $state) {
        return function() {
            var header;
            var rows = paginationFactory(sortRows);
            var status;
            var title;
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
                header = data.header;
                title = data.title;
                if (data.rows) {
                    rows.init(data.rows, transformRows);
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
                            max: row.metrics.bookedImpressions,
                            current: row.metrics.impressions
                        },
                        start: row.startDate,
                        end: row.endDate,
                        placements: row.metrics.countPlacements,
                        creatives: row.metrics.countCreatives
                    });
                }

                return newRows;
            }

            function getTable() {
                var rules = {
                    account: 'link',
                    campaign: 'link',
                    impressions: 'bullet',
                    start: 'date',
                    end: 'date',
                    placements: 'number',
                    creatives: 'number',
                    edit: ''
                };

                var headers = [
                    {name: 'Campaign', id: 'campaign'},
                    {name: 'Account', id: 'account'},
                    {name: 'Impressions & Pacing', id: 'impressions'},
                    {name: 'Start', id: 'start'},
                    {name: 'End', id: 'end'},
                    {name: 'Placements', id: 'placements'},
                    {name: 'Creatives', id: 'creatives'},
                    {name: '', id: 'edit'}
                ];

                if ($state.params.accountId) {
                    delete rules.account;
                    headers.splice(1, 1);
                }

                return {
                    header: getTableHeader(header.all()),
                    options: options,
                    content: {
                        rules: rules,
                        headers: headers,
                        data: rows.all()
                    }
                };
            }

            function getTableHeader(data) {
                var template;

                for (var i = 0; i < data.length; i++) {
                    var header = data[i];
                    if (header.status === status) {
                        template = $interpolate(headerTemplate);
                        return template({
                            status: status,
                            title: title,
                            count: header.metrics.count,
                            countPlacementsLive: header.metrics.countPlacementsLive
                        });
                    }
                }

                template = $interpolate('<span class="icon-status"></span>{{title}} (0)');
                return template({
                    title: title
                });
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
