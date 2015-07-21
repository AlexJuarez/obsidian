define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./creativePreviewModal.html');

    app.directive('creativePreviewModal', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'core/directives/creativePreviewModal.html',
            link: function(elem) {
                console.log( elem );
            }
        };

    });
});