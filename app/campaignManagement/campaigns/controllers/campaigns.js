// jshint ignore: start

define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../new-campaign.html');

    app.controller('campaignsCtrl', ['$scope', '$http', '$timeout', 'campaignsByStatus', 'navbarService', '$modal', function ($scope, $http, $timeout, campaignsByStatus, navbarService, $modal) {
        
        $scope.byStatus = [];

        function updateByStatus() {
            $scope.byStatus = campaignsByStatus.all();
        }

        campaignsByStatus.observe(updateByStatus, $scope);

        // Modal
        $scope.openModal = openModal;

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
