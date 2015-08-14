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
                'countPlacements',
                'live', 'modifiedDate', 'thumbnailUrlPrefix'
            ]
        }
    };

    var rules = {
        checked: '',
        creativeName: '',
        delivering: 'delivering',
        type: '',
        dimensions: '',
        expandedDimensions: '',
        countPlacements: '',
        options: ''
    };

    var headers = [
        {name: '', id: 'checked'},
        {name: 'Creative Name', id: 'creativeName'},
        {name: 'Delivering', id: 'delivering'},
        {name: 'Type', id: 'type'},
        {name: 'Dimensions', id: 'dimensions'},
        {name: 'Expandable', id: 'expandedDimensions'},
        {name: 'No. Placements', id: 'countPlacements'},
        {name: '', id: 'options'}
    ];

    var typeTransform = {
        'In-Banner': 'IBV',
        'In-Stream': 'IS',
        'Rich Media': 'RM',
        'Display': 'DISPLAY'
    };

    module.service('creatives', [
        'cacheFactory', '$state', 'creativeRecordService', function(cacheFactory, $state, creativeRecordService) {
            var cache = cacheFactory({
                transform: _transformCreatives
            });

            creativeRecordService.observe(function(newUpdatedRecord) {
                var creative = getCreative(newUpdatedRecord.id);

                var transformedRecord;
                if (creative) {
                    transformedRecord = transformUpdated(newUpdatedRecord, creative);
                }

                function transformUpdated(updatedRecord, existingRecord) {
                    var addRecord = {
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
                    return addRecord;
                }

                function getCreative(id) {
                    var creatives = cache.all( _apiConfig() ).data;
                    console.log( 'creatives', creatives );
                    var c;
                    for (var i=0; creatives.length > i; i++) {
                        c = creatives[i];
                        if (c.id === id) {
                            return c;
                        }
                    }
                    return false;
                }

                addData([transformedRecord]);

            }, undefined, true);

            function _transformCreatives(data) {
                console.log( 'data', data );
                var creatives = data.creatives;
                var creative;
                var transformedTable = {
                    rules: rules,
                    headers: headers,
                    data: []
                };

                for(var i = 0; i < creatives.length; i ++) {
                    creative = creatives[i];

                    transformedTable.data.push({
                        checked: '<input class="checkbox checkbox-light" type="checkbox"><span></span>',
                        creativeName: creative.name,
                        delivering: creative.live,
                        type: typeTransform[creative.type],
                        dimensions: creative.embedWidth + 'x' + creative.embedHeight,
                        expandedDimensions: creative.expandedWidth + 'x' + creative.expandedHeight,
                        countPlacements: creative.countPlacements,
                        options: '<a style="padding-right:20px;">Edit in Studio</a><span style="font-size:2rem"><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a></span>',

                        // These properties are needed by thumbnails but aren't
						// in the table
                        id: creative.id,
                        lastModified: creative.modifiedDate,
                        thumbnail: 'https://swf.mixpo.com' + creative.thumbnailUrlPrefix + 'JPG320.jpg'
                    });
                }
                //console.log( transformedTable );
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
                return cache.all(_apiConfig());
            }

            function observe(callback, $scope, preventImmediate) {
                return cache.observe(_apiConfig(), callback, $scope, preventImmediate);
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
                all: all,
                data: data,
                addData: addData,
                observe: observe
            };
        }
    ]);
});
