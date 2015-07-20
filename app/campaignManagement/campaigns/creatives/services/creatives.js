define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var baseUrl = '/fixtures/creatives/creatives.json';

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

    module.service('creatives', ['cacheFactory', '$state', function (cacheFactory, $state) {
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

            for (var i=0; i<creatives.length; i++) {
                creative = creatives[i];

                transformedTable.data.push({
                    checked: '<input class="checkbox checkbox-light" type="checkbox"><span></span>',
                    creativeName: creative.name,
                    delivering: creative.live,
                    type: creative.type,
                    dimensions: creative.embedWidth + 'x' + creative.embedHeight,
                    expandedDimensions: creative.expandedWidth + 'x' + creative.expandedHeight,
                    numPlacements: creative.numPlacements,
                    options: '<a style="padding-right:20px;">Edit in Studio</a><span style="font-size:2rem"><a><i class="glyph-icon glyph-settings"></i></a><a><i class="glyph-icon glyph-copy"></i></a><a><i class="glyph-icon glyph-close"></i></a></span>',

                    // These properties are needed by thumbnails but aren't in the table
                    lastModified: creative.lastModified,
                    thumbnail: creative.thumbnail
                });
            }

            return transformedTable;
        }

        function _filter() {
            if ($state.params.campaignId) {
                return '&filters=campaign.id:eq:' + $state.params.campaignId;
            } else {
                return '';
            }
        }

        function _url() {
            return baseUrl + _filter();
        }

        function all() {
            return cache.all(_url());
        }

        function observe(callback, $scope, preventImmediate) {
            return cache.observe(_url(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            return cache.get(_url(), initialize);
        }

        return {
            _filter: _filter,
            _transformCreatives: _transformCreatives,
            _url: _url,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
