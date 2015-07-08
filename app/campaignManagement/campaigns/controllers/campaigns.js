// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignsCtrl', ['$scope', '$modal', '$state', 'campaignsHeader', function ($scope, $modal, $state, campaignsHeader) {

        $scope.summary = [];

        function updateSummary() {
            $scope.summary = campaignsHeader.all();
        }

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
