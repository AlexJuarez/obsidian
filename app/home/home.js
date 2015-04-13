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

        $scope.state = '';
        $scope.sort = sort;

        function sort (column, event){
            var $elem = ng.element(event.currentTarget);
            var isSelected = $elem.hasClass('selected');

            if(isSelected) {
                $elem.removeClass('selected');
                $elem.removeClass('desc');
                $elem.addClass('asc');
            } else {
                $elem.addClass('selected');
                $elem.removeClass('asc');
                $elem.addClass('desc');
            }

            $scope.tableComplex.data.sort(function(a, b){
                a = a.row[column].value;
                b = b.row[column].value;

                if(typeof a === "number"){
                    if(isSelected){
                        return b - a;
                    } else {
                        return a - b;
                    }
                } else if (typeof a === "string") {
                    if(isSelected){
                        return b.localeCompare(a);
                    } else {
                        return a.localeCompare(b);
                    }
                }
            });
        }
    }]);

});

