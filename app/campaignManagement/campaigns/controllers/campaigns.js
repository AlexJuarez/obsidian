// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$http', '$timeout', 'campaignsByStatus', 'navbarService', '$modal', 'campaignsByAccount', '$state', function ($scope, $http, $timeout, campaignsByStatus, navbarService, $modal, campaignsByAccount, $state) {

        $scope.byStatus = [];

        function updateByStatus() {
            $scope.byStatus = campaignsByStatus.all();
        }

        function updateByAccount() {
            $scope.byAccount = campaignsByAccount.all();
        }

        campaignsByStatus.observe(updateByStatus, $scope);
        campaignsByAccount.observe(updateByAccount, $scope);

        // Modal
        $scope.openModal = openModal;

        $scope.params = $state.params;

        function openModal(size) {
            $modal.open({
                animation: 'true',
                templateUrl: 'campaignManagement/campaigns/new-campaign.html',
                controller: 'newCampaignCtrl',
                size: size
            });
		}


    }]);
});
