'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('placementsHeader', ['$scope', '$modal', '$rootScope', 'placements', function($scope, $modal, $rootScope, placements) {
        function updateMeta() {
            $scope.openNewPlacementModal = openNewPlacementModal;

            var newPlacementModal;
            function openNewPlacementModal() {
                if (!newPlacementModal) {
                    newPlacementModal = {
                        action: 'New'
                    };
                }

                $modal.open({
                    animation: 'true',
                    templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
                    controller: 'newEditPlacementCtrl',
                    resolve: {
                        modalState: function() {
                            return newPlacementModal;
                        }
                    },
                    size: 'lg'
                });
            }

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

                    if (placement.creatives) {
                        for(var k = 0; k < placement.creatives.length; k ++) {
                            creative = placement.creatives[k];

                            pushUnique(creatives, creative.id);

                        }
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
