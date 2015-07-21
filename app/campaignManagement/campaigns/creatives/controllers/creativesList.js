'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesListCtrl', ['$scope', '$rootScope', '$state', '$filter', 'creatives', function($scope, $rootScope, $state, $filter, creatives) {
        var filter = $state.params.filter;
        $rootScope.$on('$stateChangeSuccess', function () {
            filter = $state.params.filter;
        });

        function updateCreatives() {
            var allCreatives = creatives.all();
            var duplicateCreatives = {
                rules: allCreatives.rules,
                headers: allCreatives.headers,
                data: []
            };

            duplicateCreatives.data = $filter('filter')(allCreatives.data, {type: filter});
            $scope.creatives = duplicateCreatives;
        }

        creatives.observe(updateCreatives, $scope);
    }]);
});
