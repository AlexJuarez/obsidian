define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./creativeOptions.html');

    app.directive('creativeOptions', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                id: '='
            },
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeOptions.html',
            controller: ['$scope', '$modal', function ($scope, $modal) {
                $scope.openEditCreativeModal = openEditCreativeModal;

                var editCreativeModal;
                function openEditCreativeModal() {
                    if (!editCreativeModal) {
                        editCreativeModal = {
                            creativeId: $scope.id,
                            action: 'Edit'
                        };
                    }

                    $modal.open({
                        animation: 'true',
                        templateUrl: 'campaignManagement/campaigns/creatives/new-edit-creative.html',
                        controller: 'newEditCreativeCtrl',
                        resolve: {
                            modalState: function() {
                                return editCreativeModal;
                            }
                        },
                        size: 'lg'
                    });
                }
            }]
        };
    }]);
});
