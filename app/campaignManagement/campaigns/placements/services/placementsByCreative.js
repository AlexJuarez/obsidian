define(function (require) {
    'use strict';

    var module = require('./../../../module');

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

                if (creatives && creatives.length) {
                    for(var k = 0; k < creatives.length; k ++) {
                        creativeId = creatives[k].id;
                        if(! groups[creativeId]) {
                            groups[creativeId] = {
                                name: creatives[k].name,
                                placements: [placement]
                            };
                        } else {
                            groups[creativeId].placements.push(placement);
                        }
                    }
                }
            }

            // Get metadata about each group
            var group;
            for (creativeId in groups) {
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
                    if (placement.bookedImpressions) {
                        bookedImpressions += placement.bookedImpressions;    
                    }
                    if (placement.metrics.impressions) {
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
