define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./creativePreviewModal.html');

    app.directive('creativePreviewModal', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: false,
            templateUrl: 'core/directives/creativePreviewModal.html'
            // controller: function ($scope) {
            //     console.log( 'controller ', $scope );
            // }
        };

    });
});