define(function (require) {
    'use strict';

    var app = require('./module');

    app.directive('clientDropdown', ['clientService', '$timeout', function (clients, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = clients.pin;
                $scope.unpin = clients.unpin;

                clients.init();

                clients.observe(update);

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
