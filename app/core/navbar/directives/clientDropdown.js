define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./client.html');

    app.directive('clientDropdown', ['clientService', '$timeout', 'navbarService', function (clients, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/client.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = clients.pin;
                $scope.unpin = clients.unpin;
                $scope.section = 'Clients';
                update();
                updateCurrent();

                clients.observe(update);

                navbar.observe(updateCurrent);

                $scope.$watch('query', function (newValue) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.results = clients.search(newValue);
                        });
                    });
                });

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.current = navbar.all().client || 'All Clients';
                        });
                    });
                }

                function update() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.clientsMap = clients.alphabetMap();
                            $scope.pinned = clients.pinned();
                        });
                    });
                }
            }]
        };
    }]);
});
