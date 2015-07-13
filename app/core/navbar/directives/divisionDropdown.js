define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./division.html');

    app.directive('divisionDropdown', ['divisionService', '$timeout', 'navbarService', function (divisions, $timeout, navbar) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'core/navbar/directives/division.html',
            link: function ($scope, element) {
                $scope.pin = divisions.pin;
                $scope.unpin = divisions.unpin;
                $scope.section = 'Divisions';
                $scope.current = 'All Divisions';
                $scope.state = {};

                divisions.observe(update, $scope);
                navbar.observe(updateCurrent, $scope);
                navbar.observe(update, $scope);

                $scope.$watch('query', function (newValue) {
                    $scope.results = divisions.search(newValue);
                });

                function updateCurrent() {
                    var info = navbar.all();
                    $scope.current = info.division && info.division.name || 'All Divisions';
                    if (info.division && info.client && info.client.id) {
                        $scope.state = { clientId: info.client.id };
                    } else {
                        $scope.state = {};
                    }
                }

                function update(event) {
                    if (event === 'pin') {
                        $scope.pinned = divisions.pinned();
                    } else {
                        if (hideDivisionTab()) {
                            element.hide();
                        } else {
                            element.show();
                        }
                        $scope.divisionsMap = divisions.alphabetMap();
                        $scope.pinned = divisions.pinned();
                    }
                }

                function hideDivisionTab() {
                    // Some users have a default division with a blank name,
                    // and some users have no divisions. Hide the divisions
                    // tab for these users

                    var allDivisions = divisions.all();
                    var numDivisions = allDivisions.length;
                    return ( numDivisions === 1 &&
                            allDivisions[0].name === '' ) ||
                        numDivisions === 0;
                }
            }
        };
    }]);
});
