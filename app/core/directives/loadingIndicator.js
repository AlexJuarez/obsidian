define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./loadingIndicator.html');

    app.directive('loadingIndicator', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                isLoaded: '=loadingIndicator',
                showLoader: '='
            },
            templateUrl: 'core/directives/loadingIndicator.html'
        };
    }]);
});
