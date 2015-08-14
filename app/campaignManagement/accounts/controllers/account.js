define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../new-edit-account.html');

    app.controller('accountCtrl', ['$scope', '$state', '$modal', 'navbarService', 'campaignModal', function ($scope, $state, $modal, navbar, campaignModal) {
        $scope.openEditAccountModal = openEditAccountModal;
        function updateAccountInfo() {
            $scope.account = navbar.all().account;
        }

        navbar.observe(updateAccountInfo, $scope);

        $scope.campaignModal = campaignModal.create;

        var editAccountModal;
        function openEditAccountModal() {
            if (!editAccountModal) {
                editAccountModal = {
                    accountId: getAccountId(),
                    action: 'New'
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
