/* globals $ */
define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!../../core/modal/creativePreview.html');

    app.controller('modalCtrl', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {
        console.log( 'controller scope: ', $scope );

        $scope.testClick = testClick;
        function testClick() {
            console.log( 'controller testClick' );
        }

    }]);
});
