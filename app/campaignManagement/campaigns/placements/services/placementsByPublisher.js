define(function (require) {
    'use strict';

    var module = require('./../../../module');

    module.service('placementsByPublisher', [function () {
        return function(placements) {
            var groups = {};
            placements = [].concat(placements);
            var placement;
            var publisher;


            // Throw placements into a hash map that's indexed by publisher
            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                publisher = placement.publisher;

                if (!groups[publisher.id]) {
                    groups[publisher.id] = {
                        name: publisher.name,
                        placements: [placement]
                    };
                } else {
                    groups[publisher.id].placements.push(placement);
                }
            }

            // Get metadata about each group
            var group;
            for (var publisherId in groups) {
                group = groups[publisherId];
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
                    if (placement.bookedImpressions) {
                        bookedImpressions += placement.bookedImpressions;    
                    }
                    if ( placement.metrics.impressions ) {
                        impressions += placement.metrics.impressions;    
                    }
                    
                }

                return {
                    count: placements.length,
                    numDelivering: numDelivering,
                    bookedImpressions: bookedImpressions,
                    impressions: impressions
                };
            }

            // Throw groups into an array and sort by publisher name
            var groupArray = groupsToArray(groups);
            groupArray.sort(sortGroups);

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

            function sortGroups(a, b) {
                if (a.group.name && b.group.name) {
                    return a.group.name.localeCompare(b.group.name);
                } else {
                    return 0;
                }
            }

            return groupArray;
        };
    }]);
});
