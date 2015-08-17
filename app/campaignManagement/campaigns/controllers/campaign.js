define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignCtrl', ['$scope', '$state', '$modal', 'navbarService', function ($scope, $state, $modal, navbar) {
        $scope.openEditCampaignModal = openEditCampaignModal;
        function updateCampaignInfo() {
            $scope.campaign = navbar.all().campaign;
        }

        navbar.observe(updateCampaignInfo, $scope);

        var editCampaignModal;
        function openEditCampaignModal() {
            if (!editCampaignModal) {
                editCampaignModal = {
                    campaignId: getCampaignId(),
                    action: 'Edit'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-edit-campaign.html',
                controller: 'newEditCampaignCtrl',
                resolve: {
                    modalState: function() {
                        return editCampaignModal;
                    }
                },
                size: 'lg'
            });
        }

        $scope.placements = [
            {
                header: '<span class=\'icon-status success\'></span> Discovery (12)',
                content: {
                    'rules': {
                        name: '',
                        type: ''
                    },
                    headers: [
                        {name: 'Placement Name', id: 'name'},
                        {name: 'Placement Type', id: 'type'},
                    ],
                    data: [
                        {
                            name: 'Placement 1',
                            type: 'IBV'
                        },
                        {
                            name: 'Placement 2',
                            type: 'IS'
                        }
                    ]
                }
            }
        ];

        function getCampaignId() {
            if ($scope.campaign && $scope.campaign.id) {
                return $scope.campaign.id;
            } else {
                return $state.params.campaignId;
            }
        }


    }]);
});
