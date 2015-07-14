define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('divisionCtrl', ['$scope', 'navbarService', function ($scope, navbar) {
        function updateDivisionInfo() {
            $scope.division = navbar.all().division;
        }

        navbar.observe(updateDivisionInfo, $scope);
    }]);
});
