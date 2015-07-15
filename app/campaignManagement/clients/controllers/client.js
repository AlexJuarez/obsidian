define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.controller('clientCtrl', ['$scope', 'navbarService', function ($scope, navbar) {
        function updateClientName() {
            $scope.client = navbar.all().client;
        }

        navbar.observe(updateClientName, $scope);
    }]);
});
