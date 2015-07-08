// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', 'campaignsByStatus', '$modal', 'campaignsByAccount', '$state', 'campaignsHeader', function ($scope, campaignsByStatus, $modal, campaignsByAccount, $state, campaignsHeader) {

        $scope.summary = [];
        $scope.byStatus = [];
        $scope.byAccount = [];

        function updateByStatus() {
            $scope.byStatus = campaignsByStatus.all();
        }

        function updateByAccount() {
            $scope.byAccount = campaignsByAccount.all();
        }

        function updateSummary() {
            $scope.summary = campaignsHeader.all();
        }

        campaignsByStatus.observe(updateByStatus, $scope);
        campaignsByAccount.observe(updateByAccount, $scope);
        campaignsHeader.observe(updateSummary, $scope);

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
