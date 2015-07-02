'use strict';

define(function (require) {
    var app = require('./../../../module');

    app.controller('placementListCtrl', ['$scope', function ($scope) {
        $scope.placementTypes = [
            {
                name: 'Placement Type 1',
                value: '1'
            },
            {
                name: 'Placement Type 2',
                value: '2'
            },
            {
                name: 'Placement Type 3',
                value: '3'
            },
            {
                name: 'Placement Type 4',
                value: '4'
            },
            {
                name: 'Placement Type 5',
                value: '5'
            }
        ];
    }]);
});
