'use strict';

define(function (require) {
    var app = require('./../../../module');

    app.controller('creativeListCtrl', ['$scope', function ($scope) {
        $scope.creatives = 'creatives go here';
    }]);
});
