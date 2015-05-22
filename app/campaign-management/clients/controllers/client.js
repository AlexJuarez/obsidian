'use strict';

define(function (require) {
    var app = require('./../../module');
    //var ng = require('angular');

    app.controller('clientCtrl', ['$scope', '$http', '$timeout', '$stateParams', 'navbarService', function ($scope, $http, $timeout, $stateParams, navbar) {

        $http.get('fixtures/clients_youworkon.json').then(function (res) {
            $timeout(function () {
                $scope.youWorkOn = res.data;
                $scope.$apply();
            });
        });

        navbar.setClient($stateParams.id);
        console.log($stateParams.id + '', navbar.all());
    }]);
});
