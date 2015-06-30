'use strict';

define(function (require) {
    var app = require('./../../module');

    app.controller('placementListCtrl', ['$scope', function ($scope) {
        $scope.placements = "hello";
    }]);
});
