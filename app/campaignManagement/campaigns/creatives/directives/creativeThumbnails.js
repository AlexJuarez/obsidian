define(function (require) {
    'use strict';

    var app = require('./../../../module');

    require('tpl!./creativeThumbnails.html');

    app.directive('creativeThumbnails', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: 'campaignManagement/campaigns/creatives/directives/creativeThumbnails.html',
            controller: ['$scope', '$rootScope', '$state', '$filter', 'campaignCreative', function ($scope, $rootScope, $state, $filter, campaignCreative) {

                var filter = $state.params.filter;
                $rootScope.$on('$stateChangeSuccess', function () {
                    filter = $state.params.filter;
                });

                function updateCreatives() {
                    var creatives = campaignCreative.all();
                    var duplicateCreatives = [];

                    duplicateCreatives = $filter('filter')(creatives.data, {type: filter});
                    $scope.creatives = duplicateCreatives;
                }

                campaignCreative.observe(updateCreatives, $scope);

            }]
        };
    }]);
});
