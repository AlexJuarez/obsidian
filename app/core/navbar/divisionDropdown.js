define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('divisionDropdown', ['divisionService', '$timeout', function (divisions, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = divisions.pin;
                $scope.unpin = divisions.unpin;
                $scope.transition = transition;

                divisions.init();

                divisions.observe(update);

                function transition(divisionId) {
                    if (window.Router) {
                        window.Router.router.transitionTo('campaign-management.division.index', {divisionId: divisionId});
                    }
                }

                function update() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.divisionsMap = divisions.alphabetMap();
                            $scope.pinned = divisions.pinned();
                        });
                    });
                }
            }]
        };
    }]);
});
