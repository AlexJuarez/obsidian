define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var tableHeaderTemplate = require('tpl!./placementTableHeader.html');

    var ng = require('angular');

    var apiConfig = {
        endpoint: 'placements',
        queryParams: {
            dimensions: [
                'id', 'name', 'live', 'flightStart', 'flightEnd',
                'bookedImpressions', 'creatives.id', 'creatives.name', 'creatives.embedWidth', 'creatives.embedHeight', 'creatives.expandedWidth', 'creatives.expandedHeight', 'creatives.expandable', 'creatives.type', 'creatives.thumbnailUrlPrefix', 'publisher.id',
                'publisher.name', 'type', 'budget', 'spend'
            ],
            metrics: ['impressions']
        }
    };

    var rules = {
        checked: '',
        placementName: '',
        delivering: 'delivering',
        startDate: 'date',
        endDate: 'date',
        type: '',
        pacing: 'bullet',
        spend: 'bullet',
        creatives: 'creatives',
        options: ''
    };

    var headers = [
        {name: '', id: 'checked'},
        {name: 'Placement Name', id: 'placementName'},
        {name: 'Delivering', id: 'delivering'},
        {name: 'Start Date', id: 'startDate'},
        {name: 'End Date', id: 'endDate'},
        {name: 'Type', id: 'type'},
        {name: 'Impressions & Pacing', id: 'pacing'},
        {name: 'Spend & Budget', id: 'spend'},
        {name: 'Creatives', id: 'creatives'},
        {name: '', id: 'options'}
    ];

    module.service('placements', ['$state', '$interpolate', '$compile', '$rootScope', 'cacheFactory',
        'apiUriGenerator', 'placementsByAdType', 'placementsByCreative',
        'placementsByPublisher', 'ENUMS',
        function ($state, $interpolate, $compile, $rootScope, cache, apiUriGenerator, placementsByAdType,
        placementsByCreative, placementsByPublisher, ENUMS
    ) {
        var placementCache = cache({
            transform: function(data) {
                return data.placements;
            }
        });

        function sortPlacements(a, b) {
            return a.name.localeCompare(b.name);
        }

        function transformPlacements(data) {
            var groups = _getPlacementGroups(data.sort(sortPlacements));
            return _transformPlacementGroups(groups);
        }

        function _transformPlacementGroups(groups) {
            var transformedGroups = [];
            var groupData;
            var transformedGroup;
            var placement;

            for(var i=0; i<groups.length; i++) {
                groupData = groups[i];
                transformedGroup = {
                    header: $interpolate(tableHeaderTemplate)(groupData),
                    content: {
                        rules: rules,
                        headers: headers,
                        data: []
                    }
                };

                for(var k=0; k<groupData.group.placements.length; k++) {
                    placement = groupData.group.placements[k];
                    transformedGroup.content.data.push({
                        id: placement.id,
                        checked: '<label><input ng-click="row.selectPlacement(row.id)" class="checkbox checkbox-light" type="checkbox"><span></span></label>',
                        selectPlacement: selectPlacement,
                        placementName: placement.name,
                        delivering: placement.live,
                        startDate: placement.flightStart,
                        endDate: placement.flightEnd,
                        type: ENUMS.down.creativeTypes[placement.type],
                        pacing: {
                            current: placement.metrics.impressions,
                            max: placement.bookedImpressions
                        },
                        spend: {
                            current: placement.spend,
                            max: placement.budget
                        },
                        creatives: placement.creatives,
                        options: '<div placement-options id="\'' + placement.id + '\'"></div>'
                    });
                }

                transformedGroups.push(transformedGroup);
            }
            return transformedGroups;
        }

        function selectPlacement(id) {
            var clickedPlacement = placementCache.get(getApiConfig()).getById(id);

            var toggleSelected = function(placement) {
                placement.selected = ! (!!placement.selected);
            };

            if(clickedPlacement) {
                toggleSelected(clickedPlacement);
                placementCache.get(getApiConfig()).addData([clickedPlacement]);
            }
        }

        function getSelectedPlacementIds() {
            var placements = all(true);
            var selectedPlacements = [];
            for(var i=0; i<placements.length; i++) {
                if(placements[i].selected) {
                    selectedPlacements.push(placements[i].id);
                }
            }
            return selectedPlacements;
        }

        function _getPlacementGroups(placements) {
            var viewBy = $state.params.viewBy;
            if (viewBy === 'creative') {
                return placementsByCreative(placements);
            } else if(viewBy === 'ad-type') {
                return placementsByAdType(placements);
            } else {
                return placementsByPublisher(placements);
            }
        }

        function getApiConfig() {
            var newConfig = ng.copy(apiConfig);
            if ($state.params.campaignId) {
                newConfig.queryParams.filters = ['campaign.id:eq:' + $state.params.campaignId];
            }
            return newConfig;
        }

        function all(skipTransform) {

            // We can do this because someone using this service will be
			// observing it before they call all()
            var data = placementCache.all(getApiConfig());

            if (skipTransform) {
                return data;
            }

            return transformPlacements(data);
        }

        function observe(callback, $scope, preventImmediate) {
            placementCache.observe(getApiConfig(), callback, $scope, preventImmediate);
        }

        /**
         * Returns underlying dataFactory object for the cache entry
         * @param {boolean} [initialize=false] should we call init
         * @returns {{dataFactory}}
         */
        function data(initialize) {
            return placementCache.get(getApiConfig(), initialize);

        }

        return {
            _transformPlacementGroups: _transformPlacementGroups,
            _getPlacementGroups: _getPlacementGroups,
            _getApiConfig: getApiConfig,
            getSelectedPlacementIds: getSelectedPlacementIds,
            all: all,
            data: data,
            observe: observe
        };
    }]);
});
