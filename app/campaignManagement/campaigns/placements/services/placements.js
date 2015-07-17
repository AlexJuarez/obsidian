define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var tableHeaderTemplate = require('tpl!./placementTableHeader.html');

    //var baseApiEndpoint = {
    //    version: 3,
    //    endpoint: 'placements',
    //    dimensions: ['id', 'name', 'live', 'startDate', 'endDate', 'bookedImpressions', 'creatives', 'publisher.id', 'publisher.name', 'adType', 'budget'],
    //    metrics: ['impressions', 'spend']
    //};

    var apiURI = '/fixtures/placements/placements.json';

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

    module.service('placements', ['$state', '$interpolate', '$compile', '$rootScope', 'cacheFactory', 'apiUriGenerator', 'placementsByAdType', 'placementsByCreative', 'placementsByPublisher',
                                  function ($state, $interpolate, $compile, $rootScope, cache, apiUriGenerator, placementsByAdType, placementsByCreative, placementsByPublisher) {
        var placementCache = cache();

        function sortPlacements(a, b) {
            return a.name.localeCompare(b.name);
        }

        function transformPlacements(data) {
            if (data && data.placements) {
                var groups = getPlacementGroups(data.placements.sort(sortPlacements));
                return transformPlacementGroups(groups);
            } else {
                return [];
            }
        }

        function transformPlacementGroups(groups) {
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
                        checked: '<input class="checkbox checkbox-light" type="checkbox"><span></span>',
                        placementName: placement.name,
                        delivering: placement.live,
                        startDate: placement.startDate,
                        endDate: placement.endDate,
                        type: placement.type,
                        pacing: {
                            current: placement.metrics.impressions,
                            max: placement.bookedImpressions
                        },
                        spend: {
                            current: placement.metrics.spend,
                            max: placement.budget
                        },
                        creatives: placement.creatives,
                        options: ''
                    });
                }

                transformedGroups.push(transformedGroup);
            }

            return transformedGroups;
        }

        function getPlacementGroups(placements) {
            var viewBy = $state.params.viewBy;
            if (viewBy === 'creative') {
                return placementsByCreative(placements);
            } else if(viewBy === 'ad-type') {
                return placementsByAdType(placements);
            } else {
                return placementsByPublisher(placements);
            }
        }

        function getPlacementsUrl() {
            return apiURI; // Until API is built

            //var apiParams = ng.extend({
            //    filters: ['campaign.id:eq:' + $state.params.campaignId]
            //}, baseApiEndpoint);

            //return apiUriGenerator(apiParams);
        }

        var initializeCache = true;
        function all(skipTransform) {

            // We can do this because someone using this service will be observing it
            // before they call all()
            var data = placementCache.get(getPlacementsUrl(), initializeCache).all();
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
                placementCache.get(getPlacementsUrl(), initializeCache);
                initializeCache = false;

                placementCache.observe(getPlacementsUrl(), callback, $scope, preventImmediate);
            }
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
