define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('divisionCtrl', ['$scope', '$modal', 'navbarService', function ($scope, $modal, navbar) {
        $scope.openNewAccountModal = openNewAccountModal;

        function updateDivisionInfo() {
            $scope.division = navbar.all().division;
        }

        navbar.observe(updateDivisionInfo, $scope);

        var newAccountModal;
        function openNewAccountModal() {
            if (!newAccountModal) {
                newAccountModal = {
                    account: {
                        divisionId: $scope.division.id
                    },
                    action: 'New'
                };
            }

            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/accounts/new-edit-account.html',
                controller: 'newEditAccountCtrl',
                resolve: {
                    modalState: function() {
                        return newAccountModal;
                    }
                },
                size: 'lg'
            });
        }
    }]);
});
