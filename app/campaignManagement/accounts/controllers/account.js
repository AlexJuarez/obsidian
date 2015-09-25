define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../new-edit-account.html');

    app.controller('accountCtrl', ['$scope', '$state', '$modal', 'navbarService', function ($scope, $state, $modal, navbar) {
        $scope.openEditAccountModal = openEditAccountModal;
        $scope.openNewCampaignModal = openNewCampaignModal;

        function updateAccountInfo() {
            $scope.account = navbar.all().account;
        }

        navbar.observe(updateAccountInfo, $scope);

        var newCampaignModal;
        function openNewCampaignModal() {
            if (!newCampaignModal) {
                newCampaignModal = {
                    originalCampaign: {
                        accountId: getAccountId(),
                        startDate: new Date(),
                        endDate: new Date()
                    },
                    action: 'New'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-edit-campaign.html',
                controller: 'newEditCampaignCtrl',
                resolve: {
                    modalState: function() {
                        return newCampaignModal;
                    }
                },
                size: 'lg'
            });
        }

        var editAccountModal;
        function openEditAccountModal() {
            if (!editAccountModal) {
                editAccountModal = {
                    accountId: getAccountId(),
                    action: 'Edit'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/accounts/new-edit-account.html',
                controller: 'newEditAccountCtrl',
                resolve: {
                    modalState: function() {
                        return editAccountModal;
                    }
                },
                size: 'lg'
            });
        }

        function getAccountId() {
            if ($scope.account && $scope.account.id) {
                return $scope.account.id;
            } else {
                return $state.params.accountId;
            }
        }
    }]);
});
