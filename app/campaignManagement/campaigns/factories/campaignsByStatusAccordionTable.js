define(function (require) {
    'use strict';

    var module = require('./../../module');
    var headerTemplate = require('tpl!./../campaignsByStatusHeader.html');
    var ng = require('angular');

    module.factory('campaignAccordionTableFactory', ['paginationFactory', '$state', '$q', function (paginationFactory, $state, $q) {
        return function() {
            var header;
            var rows = paginationFactory(sortRows, undefined, undefined, { prepFn: prepFn });
            var status;
            var title;
            var options = {
                more: rows.nextPage
            };

            var displayTypeMap = {
                anyPlacementsDisplay: 'display',
                anyPlacementsInBanner: 'inBannerVideo',
                anyPlacementsRichmedia: 'richMedia',
                anyPlacementsInStream: 'inStreamVideo'
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
                if (data.rowsConfig) {
                    rows.init(data.rowsConfig, _campaignTransform);
                }
            }

            function _campaignTransform(data) {
                return data.campaigns;
            }

            function getTypes(row) {
                var output = [];

                ng.forEach(displayTypeMap, function(v, k) {
                    if(row[k]) {
                        output.push(v);
                    }
                });

                return output;
            }

            function prepFn(data) {
                var deferred = $q.defer();

                deferred.resolve({
                    id: data.id,
                    name: data.name,
                    account: {
                        name: data['account.name']
                    },
                    start: data.startDate,
                    end: data.endDate
                });

                return deferred.promise;
            }

            function _transformRows(campaigns) {
                var output = [];

                if (campaigns) {
                    var row;
                    var base = $state.includes('analytics') ? 'analytics' : 'cm';

                    for(var i=0; i<campaigns.length; i++) {
                        row = campaigns[i];
                        output.push({
                            id: row.id,
                            account: {
                                id: row.account.id,
                                route: base + '.campaigns.account({ accountId: row.account.id })',
                                name: row.account.name
                            },
                            campaign: {
                                route: base + '.campaigns.detail({ campaignId: row.id })',
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
                            type: getTypes(row).join(', '),
                            start: row.startDate,
                            end: row.endDate,
                            placements: {
                                route: base + '.campaigns.detail.placements({ campaignId: row.id })',
                                name: row.metrics.countPlacements
                            },
                            creatives: {
                                route: base + '.campaigns.detail.creatives({ campaignId: row.id })',
                                name: row.metrics.countCreatives
                            },
                            edit: ['campaign.preview', 'campaign.settings']
                        });
                    }
                }

                return output;
            }

            function findIndex(data, name) {
                var index = -1;

                for (var i = 0; i < data.length; i++) {
                    if(data[i].name === name) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function getTable(filter) {
                var index;
                var rules = {
                    account: 'tooltip-link',
                    campaign: 'tooltip-link',
                    impressions: 'bullet',
                    live: 'status',
                    start: 'date',
                    end: 'date',
                    budget: 'budget',
                    placements: 'link',
                    creatives: 'link',
                    edit: 'icons',
                    type: ''
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
                    index = findIndex(headers, 'Account');
                    if (index >= 0) {
                        headers.splice(index, 1);
                    }
                }

                if ($state.includes('analytics')) {
                    index = findIndex(headers, 'End');
                    headers.splice(index + 1, 0, {name: 'Type', id: 'type'});
                }

                return {
                    header: _getTableHeader(header.all()),
                    options: options,
                    content: {
                        rules: rules,
                        headers: headers,
                        data: _transformRows(rows.filtered(filter))
                    }
                };
            }

            function _getTableHeader(data) {
                if (!data) {
                    return '';
                }

                for (var i = 0; i < data.length; i++) {
                    var header = data[i];
                    if (header.status === status) {
                        return {
                            template: headerTemplate,
                            locals: {
                                status: status,
                                title: title,
                                count: header.metrics.count,
                                countPlacementsLive: header.metrics.countPlacementsLive
                            }
                        };
                    }
                }

                return {
                    template: '<span><span class="icon-status"></span>{{title}} (0)</span>',
                    locals: {
                        title: title
                    }
                };
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
                _findIndex: findIndex,
                _transformRows: _transformRows,
                _getTableHeader: _getTableHeader
            };
        };
    }]);
});
