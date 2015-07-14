define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');
    var tableHeaderTemplate = require('tpl!./placementTableHeader.html');

    var baseApiEndpoint = {
        version: 3,
        endpoint: 'placements',
        dimensions: ['id', 'name', 'live', 'startDate', 'endDate', 'bookedImpressions', 'creatives', 'publisher', 'adType', 'budget'],
        metrics: ['impressions', 'spend']
    };

    var rules = {
        select: '',
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
        {name: '', id: 'select'},
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

    module.service('placements', ['$state', 'dataFactory', 'apiUriGenerator', 'placementsByAdType', 'placementsByCreative', 'placementsByPublisher', function ($state, data, apiUriGenerator, placementsByAdType, placementsByCreative, placementsByPublisher) {
        var placements = data(sortPlacements);

        function sortPlacements(placements) {
            placements.sort(function(a, b) {
               return a.name.localeCompare(b.name);
            });
        }

        function transformPlacements(data) {
            var placements = data.placements;
            return getPlacementGroups(placements);
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
            var apiParams = ng.extend({
                filters: ['campaign.id:eq:' + $state.params.campaignId]
            }, baseApiEndpoint);

            return apiUriGenerator(apiParams);
        }

        function all() {
            placements.init(getPlacementsUrl(), )
        }

        function observe(callback, $scope, preventImmediate) {
        }

        return {
            all: all,
            observe: observe
        };
    }]);
});
