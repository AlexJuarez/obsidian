define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');
    var tableHeaderTemplate = require('tpl!./placementTableHeader.html');
    var creativesTemplate = require('tpl!./creatives.html');

    var baseApiEndpoint = {
        version: 3,
        endpoint: 'placements',
        dimensions: ['id', 'name', 'live', 'startDate', 'endDate', 'bookedImpressions', 'creatives', 'publisher.id', 'publisher.name', 'adType', 'budget'],
        metrics: ['impressions', 'spend']
    };

    var apiURI = '/fixtures/placements/placements.json';

    var rules = {
        checked: '',
        placementName: '',
        delivering: '',
        startDate: 'date',
        endDate: 'date',
        type: '',
        pacing: 'bullet',
        spend: 'bullet',
        creatives: '',
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

    module.service('placements', ['$state', '$interpolate', 'cacheFactory', 'apiUriGenerator', 'placementsByAdType', 'placementsByCreative', 'placementsByPublisher', function ($state, $interpolate, cache, apiUriGenerator, placementsByAdType, placementsByCreative, placementsByPublisher) {
        var placementCache = cache();

        function sortPlacements(a, b) {
            return a.name.localeCompare(b.name);
        }

        function transformPlacements(data) {
            var groups = getPlacementGroups(data.placements.sort(sortPlacements));
            return transformPlacementGroups(groups);
        }

        function transformPlacementGroups(groups) {
            var transformedGroups = [];
            var group;
            var transformedGroup;
            var placement;
            var creativesString;

            for(var i=0; i<groups.length; i++) {
                group = groups[i];
                transformedGroup = {
                    header: $interpolate(tableHeaderTemplate)(group),
                    content: {
                        rules: rules,
                        headers: headers,
                        data: []
                    }
                };

                for(var k=0; k<group.placements.length; k++) {
                    placement = group.placements[k];
                    creativesString = getCreativesString(placement);
                    transformedGroup.data.push({
                        checked: '<input class="checkbox checkbox-light" type="checkbox" checked><span></span>',
                        placementName: placement.name,
                        delivering: placement.live,
                        startDate: placement.startDate,
                        endDate: placement.endDate,
                        type: placement.adType,
                        pacing: {
                            current: placement.metrics.impressions,
                            target: placement.bookedImpressions
                        },
                        spend: {
                            current: placement.metrics.spend,
                            target: placement.budget
                        },
                        creatives: $interpolate(creativesTemplate)(placement.creatives),
                        options: ''
                    });
                }

                transformedGroups.push(transformedGroup);
            }
        }

        function getPlacementGroups(placements) {
            var viewBy = $state.params.viewBy;
            if (viewBy === 'creative') {
                return placementsByCreative(placements);
            } else if(viewBy === 'adType') {
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
        function all() {

            // We can do this because someone using this service will be observing it
            // before they call all()
            var data = placementCache.get(getPlacementsUrl(), initializeCache).all();
            initializeCache = false;

            var placements = transformPlacements(data);
            return placements;
        }

        function observe(callback, $scope, preventImmediate) {
            var data = placementCache.get(getPlacementsUrl(), initializeCache);
            initializeCache = false;

            placementCache.observe(callback, $scope, preventImmediate);
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
