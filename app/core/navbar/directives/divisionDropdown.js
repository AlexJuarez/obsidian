define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.directive('divisionDropdown', ['divisionService', '$timeout', function (divisions, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = divisions.pin;
                $scope.unpin = divisions.unpin;
                $scope.transition = transition;

                divisions.observe(update);

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
