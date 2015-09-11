'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesListCtrl', ['$scope', '$rootScope', '$state', '$filter', 'creatives', function($scope, $rootScope, $state, $filter, creatives) {
        $scope.filter = $state.params.filter;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            $scope.filter = toParams.filter;
        });

        function updateCreatives() {
            var allCreatives = creatives.all();
            var duplicateCreatives = {
                rules: allCreatives.rules,
                headers: allCreatives.headers,
                data: []
            };

            duplicateCreatives.data = $filter('filter')(allCreatives.data, {type: $scope.filter});
            $scope.creatives = duplicateCreatives;
        }

        creatives.observe(updateCreatives, $scope);
    }]);
});
