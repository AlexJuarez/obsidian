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
                $scope.state = navbar.params();

                accounts.observe(update, $scope);
                navbar.observe(updateCurrent, $scope);
                navbar.observe(update, $scope);

                $scope.$watch('query', function (newValue) {
                    $scope.results = accounts.search(newValue);
                });

                function updateCurrent() {
                    var info = navbar.all();
                    $scope.current = info.account && info.account.name || 'All Accounts';
                    if (info.account && info.division && info.division.id) {
                        $scope.state = { divisionId: info.division.id };
                    } else {
                        $scope.state = navbar.params();
                    }
                }

                function update(event) {
                    if (event === 'pin') {
                        $scope.pinned = accounts.pinned();
                    } else {
                        $scope.accountsMap = accounts.alphabetMap();
                        $scope.pinned = accounts.pinned();
                    }
                }
            }]
        };
    }]);
});
