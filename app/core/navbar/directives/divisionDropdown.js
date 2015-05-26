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
                update();
                updateCurrent();

                $scope.state = navbar.params();

                $scope.$watch('query', function (newValue) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.results = divisions.search(newValue);
                        });
                    });
                });

                divisions.observe(update);

                navbar.observe(updateCurrent);
                navbar.observe(update);

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            var info = navbar.all();
                            $scope.current = info.division && info.division.name || 'All Divisions';
                            if (info.division && info.client && info.client.id) {
                                $scope.state = { clientId: info.client.id };
                            } else {
                                $scope.state = navbar.params();
                            }
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
