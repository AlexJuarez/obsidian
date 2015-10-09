'use strict';

define(function (require) {
    var app = require('./../../../module');

    app.controller('placementsListCtrl', ['$scope', '$state', 'placements', function ($scope, $state, placements) {
        $scope.placements = [];
        $scope.params = $state.params;
        $scope.placementTypes = [
            {
                name: 'Add Manually',
                value: '1'
            },
            {
                name: 'Upload Media Plan',
                value: '2'
            }
        ];
        $scope.placementsAreLoaded = false;
        $scope.showLoader = false;

        // Show spinner if data not loaded
        if ( !placements.data().isLoaded() ) {
            $scope.showLoader = true;
        }

        placements.observe(updatePlacements, $scope);
        function updatePlacements() {
            $scope.placements = placements.all();

            // Stop the loading spinner if data loaded
            if ( placements.data().isLoaded() ) {
                $scope.placementsAreLoaded = true;
            }
        }
    }]);
});
