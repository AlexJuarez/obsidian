'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesListCtrl', ['$scope', '$rootScope', '$state', '$filter', 'campaignCreative', function($scope, $rootScope, $state, $filter, campaignCreative) {
        var filter = $state.params.filter;
        $rootScope.$on('$stateChangeSuccess', function () {
            filter = $state.params.filter;
        });

        function updateCreatives() {
            var creatives = campaignCreative.all();
            var duplicateCreatives = {
                rules: creatives.rules,
                headers: creatives.headers,
                data: []
            };

            duplicateCreatives.data = $filter('filter')(creatives.data, {type: filter});
            $scope.creatives = duplicateCreatives;
        }

        campaignCreative.observe(updateCreatives, $scope);
    }]);
});
