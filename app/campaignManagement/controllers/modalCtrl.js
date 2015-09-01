define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('modalCtrl', ['$scope', function ($scope) {
        $scope.testClick = testClick;
        function testClick() {
            console.log( 'controller testClick' );
        }

    }]);
});
