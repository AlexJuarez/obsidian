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
            var creative;

            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                creatives = placement.creatives;

                for(var k= 0; k<creatives.length; k++) {
                    creative = creatives[k];
                    if (!groups[creative]) {
                        groups[creative] = [placement];
                    } else {
                        groups[creative].push(placement);
                    }
                }
            }

            return groups;
        }
    }]);
});
