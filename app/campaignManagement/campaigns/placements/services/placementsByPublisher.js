define(function (require) {
    'use strict';

    var module = require('./../../../module');
    var ng = require('angular');

    module.service('placementsByPublisher', [function () {
        return function(placements) {
            var groups = {};
            placements = [].concat(placements);
            var placement;
            var publisher;


            for(var i=0; i<placements.length; i++) {
                placement = placements[i];
                publisher = placement.publisher;

                if (!groups[publisher]) {
                    groups[publisher] = [placement];
                } else {
                    groups[publisher].push(placement);
                }
            }

            return groups;
        }
    }]);
});
