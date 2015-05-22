define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./division.html');

    app.directive('divisionDropdown', ['divisionService', '$timeout', 'navbarService', function (divisions, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/division.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = divisions.pin;
                $scope.unpin = divisions.unpin;
                $scope.section = 'Divisions';
                $scope.current = 'All Divisions';

                divisions.observe(update);

                navbar.observe(updateCurrent);

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.current = navbar.all().division || 'All Divisions';
                        });
                    });
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
