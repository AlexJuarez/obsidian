define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!../../core/modal/creativePreview.html');

    app.controller('modalCtrl', ['$scope', function ($scope) {
        console.log( 'controller scope: ', $scope );

        $scope.testClick = testClick;
        function testClick() {
            console.log( 'controller testClick' );
        }

    }]);
});
