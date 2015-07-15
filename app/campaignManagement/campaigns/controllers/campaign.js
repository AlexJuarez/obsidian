define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('campaignCtrl', ['$scope', 'navbarService', function ($scope, navbar) {
        function updateCampaignInfo() {
            $scope.campaign = navbar.all().campaign;
        }

        navbar.observe(updateCampaignInfo, $scope);

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


    }]);
});
