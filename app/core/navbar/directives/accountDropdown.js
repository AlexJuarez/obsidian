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

                $scope.state = navbar.params();

                $scope.$watch('query', function (newValue) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.results = accounts.search(newValue);
                        });
                    });
                });

                accounts.observe(update);

                navbar.observe(updateCurrent);
                navbar.observe(update);

                function updateCurrent() {
                    $timeout(function () {
                        $scope.$apply(function () {
                            var info = navbar.all();
                            $scope.current = info.account && info.account.name || 'All Accounts';
                            if (info.account && info.division && info.division.id) {
                                $scope.state = { divisionId: info.division.id };
                            } else {
                                $scope.state = navbar.params();
                            }
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
