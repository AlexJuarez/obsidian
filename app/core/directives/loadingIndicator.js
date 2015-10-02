define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./loadingIndicator.html');

    app.directive('loadingIndicator', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                isLoaded: '='
            },
            templateUrl: 'core/directives/loadingIndicator.html',
            link: function (scope, elem, attr) {
                
                scope.$watch(attr.isLoaded, function() {
                    
                });

                
            }
        };
    }]);
});
