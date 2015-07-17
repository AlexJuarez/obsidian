'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('placementsHeader', ['$scope', '$rootScope', 'placements', function($scope, $rootScope, placements) {
        function updateMeta() {
            var allPlacements = placements.all(true).placements;

            if (allPlacements) {
                var placement;
                var creative;

                var publishers = [];
                var creatives = [];
                var types = [];

                for(var i=0; i<allPlacements.length; i++) {
                    placement = allPlacements[i];

                    pushUnique(publishers, placement.publisher.id);
                    pushUnique(types, placement.type);

                    for (var k=0; k<placement.creatives.length; k++) {
                        creative = placement.creatives[k];

                        pushUnique(creatives, creative.id);
                    }
                }

                $scope.placementsMeta = {
                    publishers: publishers.length,
                    creatives: creatives.length,
                    types: types.length
                };
            }
        }
        updateMeta();
        placements.observe(updateMeta, $scope, true);

        /**
         * Push an item to an array if the item isn't already in the array
         * @param array
         * @param item
         */
        function pushUnique(array, item) {
            if (!inArray(item, array)) {
                array.push(item);
            }
        }

        function inArray(needle, haystack) {
            return haystack.indexOf(needle) > -1;
        }
    }]);
});
