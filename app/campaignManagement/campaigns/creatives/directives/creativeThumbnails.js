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
            controller: ['$scope', '$rootScope', '$state', '$filter', 'creatives', function ($scope, $rootScope, $state, $filter, creatives) {

                var filter = $state.params.filter;
                $rootScope.$on('$stateChangeSuccess', function () {
                    filter = $state.params.filter;
                });

                function updateCreatives() {
                    var allCreatives = creatives.all();
                    var duplicateCreatives = [];

                    duplicateCreatives = $filter('filter')(allCreatives.data, {type: filter});
                    $scope.creatives = duplicateCreatives;
                }

                creatives.observe(updateCreatives, $scope);

            }]
        };
    }]);
});
