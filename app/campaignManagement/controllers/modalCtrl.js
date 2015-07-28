define(function (require) {
    'use strict';

    var app = require('./../module');

    app.controller('modalCtrl', ['$scope', function ($scope) {
        $scope.showOnClick = function(e, wrapper) {
            console.log( 'showOnClick' );
            e.stopPropagation();
            wrapper.addClass('show');
        };
        function openPreviewPage(e) {
            console.log( 'open page' );
            e.stopPropagation();
        }
    }]);
});
