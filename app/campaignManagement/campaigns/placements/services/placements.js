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
                'bookedImpressions', 'creatives.id', 'creatives.name', 'publisher.id',
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

    var typeTransform = {
        'In-Banner': 'IBV',
        'In-Stream': 'IS',
        'Rich Media': 'RM',
        'Display': 'DISPLAY'
    };

    module.service('placements', ['$state', '$interpolate', '$compile', '$rootScope', 'cacheFactory', 'apiUriGenerator', 'placementsByAdType', 'placementsByCreative', 'placementsByPublisher',
                                  function ($state, $interpolate, $compile, $rootScope, cache, apiUriGenerator, placementsByAdType, placementsByCreative, placementsByPublisher) {
        var placementCache = cache({
            transform: function(data) {
                return data.placements;
            }
        });

        function sortPlacements(a, b) {
            return a.name.localeCompare(b.name);
        }

        function transformPlacements(data) {
            if (data) {
                var groups = _getPlacementGroups(data.sort(sortPlacements));
                return _transformPlacementGroups(groups);
            } else {
                return [];
            }
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
                        type: typeTransform[placement.type],
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
            var placementsData = placementCache.get(getPlacementsApiConfig());
            var placements = placementsData.all();
            var clickedPlacement;
            for(var i=0; i<placements.length; i++) {
                if(placements[i].id === id) {
                    clickedPlacement = placements[i];
                }
            }

            var toggleSelected = function(placement) {
                placement.selected = ! (!!placement.selected);
            };

            if(clickedPlacement) {
                toggleSelected(clickedPlacement);
                placementsData.addData([clickedPlacement]);
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

        function getPlacementsApiConfig() {

            var newConfig = ng.copy(apiConfig);
            if ($state.params.campaignId) {
                newConfig.queryParams.filters = ['campaign.id:eq:' + $state.params.campaignId];
            }
            return newConfig;
        }

        var initializeCache = true;
        function all(skipTransform) {

            // We can do this because someone using this service will be
						// observing it before they call all()
            var data = placementCache.get(getPlacementsApiConfig(), initializeCache).all();
            initializeCache = false;

            if (skipTransform) {
                return data;
            }

            var placements = transformPlacements(data);
            return placements;
        }

        function observe(callback, $scope, preventImmediate) {

            updateCache();

            function updateCache() {
                placementCache.get(getPlacementsApiConfig(), initializeCache);
                initializeCache = false;

                placementCache.observe(getPlacementsApiConfig(), callback, $scope, preventImmediate);
            }
        }

        return {
            _transformPlacementGroups: _transformPlacementGroups,
            _getPlacementGroups: _getPlacementGroups,
            getSelectedPlacementIds: getSelectedPlacementIds,
            all: all,
            observe: observe
        };
    }]);
});
