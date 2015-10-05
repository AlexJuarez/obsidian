'use strict';

define(function(require) {
    var app = require('./../../../module');

    app.controller('creativesCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state) {
        $scope.viewAs = $state.params.viewAs;

        var cleanup = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
            $scope.viewAs = toParams.viewAs;
        });

        $scope.$on('$destroy', function() {
            cleanup();
        })
    }]);
});
