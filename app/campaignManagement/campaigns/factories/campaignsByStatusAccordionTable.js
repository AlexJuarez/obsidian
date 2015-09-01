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
                    if (a.campaign.name && b.campaign.name) {
                        return a.campaign.name.localeCompare(b.campaign.name);
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
                if (data.rowsConfig) {
                    rows.init(data.rowsConfig, _transformRows);
                }
            }

            function _transformRows(data) {
                var rows = data.campaigns;
                var newRows = [];
                var row;

                for(var i=0; i<rows.length; i++) {
                    row = rows[i];
                    newRows.push({
                        id: row.id,
                        account: {
                            id: row.account.id,
                            route: 'cm.campaigns.account({ accountId: row.account.id })',
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
                        live: row.live,
                        budget: {
                            budget: row.budget,
                            spend: row.spend
                        },
                        start: row.startDate,
                        end: row.endDate,
                        placements: {
                            route: 'cm.campaigns.detail.placements({ campaignId: row.id })',
                            name: row.metrics.countPlacements
                        },
                        creatives: {
                            route: 'cm.campaigns.detail.creatives.thumbnails({ campaignId: row.id })',
                            name: row.metrics.countCreatives
                        },
                        edit: ['campaign.preview', 'campaign.settings']
                    });
                }

                return newRows;
            }

            function getTable(filter) {
                var rules = {
                    account: 'link',
                    campaign: 'link',
                    impressions: 'bullet',
                    live: 'status',
                    start: 'date',
                    end: 'date',
                    budget: 'budget',
                    placements: 'link',
                    creatives: 'link',
                    edit: 'icons'
                };

                var headers = [
                    {name: 'Account', id: 'account'},
                    {name: 'Campaign', id: 'campaign'},
                    {name: 'Delivering', id: 'live'},
                    {name: 'Start', id: 'start'},
                    {name: 'End', id: 'end'},
                    {name: 'Impressions & Pacing', id: 'impressions'},
                    {name: 'Budget', id: 'budget'},
                    {name: 'Placements', id: 'placements'},
                    {name: 'Creatives', id: 'creatives'},
                    {name: '', id: 'edit'}
                ];

                if ($state.params.accountId) {
                    delete rules.account;
                    headers.splice(1, 1);
                }

                return {
                    header: _getTableHeader(header.all()),
                    options: options,
                    content: {
                        rules: rules,
                        headers: headers,
                        data: rows.filtered(filter)
                    }
                };
            }

            function _getTableHeader(data) {
                var template;

                if (!data) {
                    return '';
                }
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

            function notifyObservers() {
                header.notifyObservers();
                rows.notifyObservers();
            }

            return {
                init: init,
                observe: observe,
                all: getTable,
                notifyObservers: notifyObservers,
                _transformRows: _transformRows,
                _getTableHeader: _getTableHeader
            };
        };
    }]);
});
