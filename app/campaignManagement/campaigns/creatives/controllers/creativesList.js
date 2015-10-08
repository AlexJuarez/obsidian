'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesListCtrl', ['$scope', '$rootScope', '$state', '$filter', 'creatives', 'ENUMS', function($scope, $rootScope, $state, $filter, creatives, ENUMS) {
        $scope.filter = ENUMS.up.creativeTypes[$state.params.filter];

        var cleanUp = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            $scope.filter = ENUMS.up.creativeTypes[toParams.filter];
        });

        $scope.$on('$destroy', function() {
            cleanUp();
        });

        function updateCreatives() {
            var allCreatives = creatives.all();
            var duplicateCreatives = {
                rules: allCreatives.rules,
                headers: allCreatives.headers,
                data: []
            };

            duplicateCreatives.data = $filter('filter')(allCreatives.data, { type: $scope.filter });
            $scope.creatives = duplicateCreatives;
        }

        creatives.observe(updateCreatives, $scope);
    }]);
});
