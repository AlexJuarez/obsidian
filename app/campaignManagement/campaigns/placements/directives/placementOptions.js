define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./placement-options.html');

    app.directive('placementOptions', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                id: '='
            },
            templateUrl: 'campaignManagement/campaigns/placements/directives/placement-options.html',
            controller: ['$scope', '$modal', function ($scope, $modal) {
                $scope.openEditPlacementModal = openEditPlacementModal;

                var editPlacementModal, placementId;
                function openEditPlacementModal() {
                    if (!editPlacementModal || placementId !== $scope.id) {
                        placementId = $scope.id;
                        editPlacementModal = {
                            placementIds: [$scope.id],
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
