define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./account.html');

    app.directive('accountDropdown', ['accountService', '$timeout', 'navbarService', function (accounts, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/account.html',
            controller: ['$scope', function ($scope) {
                $scope.pin = accounts.pin;
                $scope.unpin = accounts.unpin;
                $scope.section = 'Accounts';
                $scope.current = 'All Accounts';
                update();
                updateCurrent();

                accounts.observe(update);

                navbar.observe(updateCurrent);

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.current = navbar.all().account || 'All Accounts';
                        });
                    });
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
