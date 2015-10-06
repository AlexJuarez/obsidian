define(function(require) {
    'use strict';

    var module = require('./../../../module');

    var ng = require('angular');

    var apiConfig = {
        endpoint: 'creatives',
        queryParams: {
            dimensions: [
                'id', 'name', 'live', 'type', 'device', 'embedWidth',
                'embedHeight', 'expandedWidth', 'expandedHeight',
                'countPlacements', 'modifiedDate', 'thumbnailUrlPrefix', 'campaign.id'
            ],
            limit: 500
        }
    };

    var rules = {
        checked: 'checkbox',
        creativeName: '',
        delivering: 'delivering',
        type: '',
        dimensions: '',
        expandedDimensions: '',
        numPlacements: 'link',
        options: ''
    };

    var headers = [
        {name: '', id: 'checked'},
        {name: 'Creative Name', id: 'creativeName'},
        {name: 'Delivering', id: 'delivering'},
        {name: 'Type', id: 'type'},
        {name: 'Dimensions', id: 'dimensions'},
        {name: 'Expandable', id: 'expandedDimensions'},
        {name: 'No. Placements', id: 'numPlacements'},
        {name: '', id: 'options'}
    ];

    module.service('creatives', [
        'cacheFactory', '$state', 'creativeRecordService', function(cacheFactory, $state, creativeRecordService) {
            var cache = cacheFactory({
                transform: function(data) {
                    return data.creatives;
                }
            });

            creativeRecordService.observe(function(event, record) {
                if (event === 'create' || event === 'update') {
                    var existingRecord = getCreative(record.id);

                    if (!existingRecord) {
                        // Set up defaults for a new record
                        existingRecord = {
                            lastModified: new Date(),
                            delivering: false,
                            countPlacements: 0
                        };
                    }

                    var transformedRecord = transformCrudRecord(record.get(), existingRecord);
                    addData([transformedRecord]);
                }
            }, undefined, true);

            function transformCrudRecord(updatedRecord, existingRecord) {
                return {
                    campaign: existingRecord.campaign,
                    deleted: updatedRecord.deleted,
                    embedHeight: updatedRecord.embedHeight,
                    expandedWidth: updatedRecord.expandedWidth,
                    embedWidth: updatedRecord.embedWidth,
                    expandedHeight: updatedRecord.expandedHeight,
                    modifiedDate: existingRecord.lastModified,
                    name: updatedRecord.name,
                    id: updatedRecord.id,
                    thumbnailUrlPrefix:  updatedRecord.thumbnailUrlPrefix,
                    type: updatedRecord.type,
                    device: updatedRecord.device,
                    live: existingRecord.delivering,
                    countPlacements: existingRecord.countPlacements
                };
            }

            function getCreative(id) {
                var creatives = cache.all( _apiConfig() );
                var c;
                for (var i=0; creatives.length > i; i++) {
                    c = creatives[i];
                    if (c.id === id) {
                        return c;
                    }
                }
                return false;
            }

            function _transformCreatives(creatives) {
                var creative;
                var transformedTable = {
                    rules: rules,
                    headers: headers,
                    data: []
                };

                for(var i = 0; i < creatives.length; i ++) {
                    creative = creatives[i];
                    transformedTable.data.push({
                        checked: false,
                        creativeName: creative.name,
                        delivering: creative.live,
                        type: creative.type,
                        dimensions: creative.embedWidth + 'x' + creative.embedHeight,
                        expandedDimensions: creative.expandedWidth + 'x' + creative.expandedHeight,
                        campaignId: creative.campaign.id,
                        numPlacements: {
                            name: creative.countPlacements || 0,
                            route: 'cm.campaigns.detail.placements({ campaignId: row.campaignId })'
                        },
                        options: '<div creative-options id="\'' + creative.id + '\'"></div>',

                        // These properties are needed by thumbnails but aren't
                        // in the table
                        id: creative.id,
                        lastModified: creative.modifiedDate,
                        thumbnail: creative.thumbnailUrlPrefix ? 'https://swf.mixpo.com' + creative.thumbnailUrlPrefix + 'JPG320.jpg' : ''
                    });
                }
                return transformedTable;
            }

            function _apiConfig() {

                var newConfig = ng.copy(apiConfig);
                if ($state.params.campaignId) {
                    newConfig.queryParams.filters = ['campaign.id:eq:' + $state.params.campaignId];
                }

                return newConfig;
            }

            function all() {
                return _transformCreatives(cache.all(_apiConfig()));
            }

            function setLimit(limit) {
                apiConfig.queryParams.limit = limit;
            }

            function observe(callback, $scope, preventImmediate, preventInit) {
                return cache.observe(_apiConfig(), callback, $scope, preventImmediate, preventInit);
            }

            function addData(newData) {
                cache.addData(_apiConfig(), newData);
            }

            /**
             * Returns underlying dataFactory object for the cache entry
             * @param {boolean} [initialize=false] should we call init
             * @returns {{dataFactory}}
             */
            function data(initialize) {
                return cache.get(_apiConfig(), initialize);
            }

            return {
                _transformCreatives: _transformCreatives,
                _apiConfig: _apiConfig,
                _getCreative: getCreative,
                setLimit: setLimit,
                all: all,
                data: data,
                addData: addData,
                observe: observe
            };
        }
    ]);
});
