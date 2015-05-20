'use strict';

define(function (require) {
    var app = require('./../../module');
    //var ng = require('angular');

    app.controller('clientCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
        $http.get('fixtures/clients_youworkon.json').then(function (res) {
            $timeout(function () {
                $scope.youWorkOn = res.data;
                $scope.$apply();
            });
        });
    }]);
});
