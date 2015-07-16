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

        placements.observe(updatePlacements, $scope);
        function updatePlacements() {
            console.log('updating placements');
            $scope.placements = placements.all();
        }
    }]);
});
