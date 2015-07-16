define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');

    module.service('placementsByCreative', [function () {
        return function(placements) {
            var groups = {};
            placements = [].concat(placements);
            var placement;
            var creatives;
            var creativeId;

            // Throw placements into a hash map that's indexed by creative id
            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                creatives = placement.creatives;

                for(var k= 0; k<creatives.length; k++) {
                    creativeId = creatives[k].id;
                    if (!groups[creativeId]) {
                        groups[creativeId] = {
                            creative: creatives[k],
                            placements: [placement]
                        };
                    } else {
                        groups[creativeId].placements.push(placement);
                    }
                }
            }

            // Get metadata about each group
            var group;
            for (var creativeId in groups) {
                group = groups[creativeId];
                group.meta = getMeta(group.placements);
            }

            function getMeta(placements) {
                var placement;
                var numDelivering = 0;
                var bookedImpressions = 0;
                var impressions = 0;

                for (var i=0; i<placements.length; i++) {
                    placement = placements[i];
                    if (placement.live) {
                        numDelivering++;
                    }
                    bookedImpressions += placement.bookedImpressions;
                    impressions += placements.metrics.impressions;
                }

                return {
                    count: placements.length,
                    numDelivering: numDelivering,
                    bookedImpressions: bookedImpressions,
                    impressions: impressions
                }
            }

            // Throw groups into an array and sort by creative name
            var groupArray = groupsToArray(groups);
            groupArray.sort(sortFn);

            function groupsToArray(groupObject) {
                var groupArray = [];
                for (var group in groupObject) {
                    groupArray.push({
                        id: group,
                        group: groupObject[group]
                    });
                }

                return groupArray;
            }

            function sortFn(a, b) {
                if (a.group.creative.name && b.group.creative.name) {
                    return a.group.creative.name.localeCompare(b.group.creative.name);
                } else {
                    return 0;
                }
            }

            return groupArray;
        }
    }]);
});
