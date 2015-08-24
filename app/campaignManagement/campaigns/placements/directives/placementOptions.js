define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./placementOptions.html');

    app.directive('placementOptions', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                id: '='
            },
            templateUrl: 'campaignManagement/campaigns/placements/directives/placementOptions.html',
            controller: ['$scope', '$modal', function ($scope, $modal) {
                $scope.openEditPlacementModal = openEditPlacementModal;

                var editPlacementModal;
                function openEditPlacementModal() {
                    if (!editPlacementModal) {
                        editPlacementModal = {
                            placementId: $scope.id,
                            action: 'Edit'
                        };
                    }

                    $modal.open({
                        animation: 'true',
                        templateUrl: 'campaignManagement/campaigns/placements/new-edit-placement.html',
                        controller: 'newEditPlacementCtrl',
                        resolve: {
                            modalState: function() {
                                return editPlacementModal;
                            }
                        },
                        size: 'lg'
                    });
                }
            }]
        };
    }]);
});
