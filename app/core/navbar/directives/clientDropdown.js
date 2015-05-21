define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./client.html');

    app.directive('clientDropdown', ['clientService', '$timeout', function (clients, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/client.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = clients.pin;
                $scope.unpin = clients.unpin;
                $scope.section = 'Clients';
                $scope.current = 'All Clients';

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
