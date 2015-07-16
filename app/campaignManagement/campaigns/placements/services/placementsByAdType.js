define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');

    module.service('placementsByAdType', [function () {
        return function(placements) {
            var groups = {};
            placements = [].concat(placements);
            var placement;
            var adType;

            // Throw placements into a hash map that's indexed by publisher
            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                adType = placement.adType;

                if (!groups[adType]) {
                    groups[adType] = {
                        adType: adType,
                        placements: [placement]
                    }
                } else {
                    groups[adType].placements.push(placement);
                }
            }

            // Get metadata about each group
            var group;
            for (var adType in groups) {
                group = groups[adType];
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
                if (a.group.adType && b.group.adType) {
                    return a.group.adType.localeCompare(b.group.adType);
                } else {
                    return 0;
                }
            }
        }
    }]);
});
