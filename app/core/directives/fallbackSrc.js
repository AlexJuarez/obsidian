define(function (require) {
    'use strict';

    var app = require('./../module');

    var ng = require('angular');

    app.directive('fallbackSrc', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.one('error', function() {
                    ng.element(this).attr('src', attrs.fallbackSrc);
                });
            }
        };
    });
});
