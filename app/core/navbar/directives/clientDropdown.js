define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.directive('clientDropdown', ['clientService', '$timeout', function (clients, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = clients.pin;
                $scope.unpin = clients.unpin;
                $scope.transition = transition;

                clients.observe(update);

                function transition(clientId) {
                    if (window.Router) {
                        window.Router.router.transitionTo('campaign-management.client.index', {clientId: clientId});
                    }
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
