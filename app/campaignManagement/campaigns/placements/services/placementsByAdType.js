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


            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                adType = placement.adType;

                if (!groups[adType]) {
                    groups[adType] = [placement];
                } else {
                    groups[adType].push(placement);
                }
            }

            return groups;
        }
    }]);
});
