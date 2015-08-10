define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./client.html');

    app.directive('clientDropdown', ['clientService', '$timeout', 'navbarService', 'clientRecordService', function (clients, $timeout, navbar, clientRecordService) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/client.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = clients.pin;
                $scope.unpin = clients.unpin;
                $scope.section = 'Clients';

                clients.observe(update, $scope);
                navbar.observe(updateCurrent, $scope);

                $scope.$watch('query', function (newValue) {
                    refreshSearch(newValue);
                });

                clientRecordService.observe(function() {
                    refreshSearch($scope.query);
                });

                function refreshSearch(newValue) {
                    $scope.results = clients.search(newValue);
                }

                function updateCurrent() {
                    var info = navbar.all();
                    $scope.current = info.client && info.client.name || 'All Clients';
                }

                function update(event) {
                    if (event === 'pin') {
                        $scope.pinned = clients.pinned();
                    } else {
                        $scope.clientsMap = clients.alphabetMap();
                        $scope.pinned = clients.pinned();
                    }
                }
            }]
        };
    }]);
});
