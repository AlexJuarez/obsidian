/**
 * Created by Alex on 3/2/2015.
 */
/* jshint camelcase: false */
/* jshint -W098 */

'use strict';

define(function (require) {
    var app = require('./module');
    var ng = require('angular');

    app.controller('HomeCtrl', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {

        $http.get('fixtures/table.json').then(function(res){
            $scope.table = res.data;
        });

        $http.get('fixtures/table_complex.json').then(function(res){
            $scope.tableComplex = res.data;
        });
    }]);

});

