define(function (require) {
    'use strict';

    var app = require('./module');

    app.directive('accountDropdown', ['accountService', '$timeout', function (accounts, $timeout) {
        return {
            restrict: 'A',
            scope: true,
            controller: ['$scope', function ($scope) {
                $scope.pin = accounts.pin;
                $scope.unpin = accounts.unpin;
                $scope.transition = transition;

                accounts.init();

                accounts.observe(update);

                function transition(accountId) {
                    if(window.Router) {
                        window.Router.router.transitionTo('campaign-management.account.index', {accountId: accountId});
                    }
                }

                function update() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.accountsMap = accounts.alphabetMap();
                            $scope.pinned = accounts.pinned();
                        });
                    });
                }
            }]
        };
    }]);
});
