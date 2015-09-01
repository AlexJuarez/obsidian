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
        numPlacements: '',
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

    var typeTransform = {
        'In-Banner': 'IBV',
        'In-Stream': 'IS',
        'Rich Media': 'RM',
        'Display': 'DISPLAY'
    };

    module.service('creatives', [
        'cacheFactory', '$state', function(cacheFactory, $state) {
            var cache = cacheFactory({
                transform: _transformCreatives
            });

            function _transformCreatives(data) {
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
                        numPlacements: creative.numPlacements,
                        options: '<div creative-options id="\'' + creative.id + '\'"></div>',

                        // These properties are needed by thumbnails but aren't
						// in the table
                        id: creative.id,
                        lastModified: creative.modifiedDate,
                        thumbnail: 'https://swf.mixpo.com' + creative.thumbnailUrlPrefix + 'JPG320.jpg'
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
                return cache.all(_apiConfig());
            }

            function observe(callback, $scope, preventImmediate) {
                return cache.observe(_apiConfig(), callback, $scope, preventImmediate);
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
                observe: observe
            };
        }
    ]);
});
