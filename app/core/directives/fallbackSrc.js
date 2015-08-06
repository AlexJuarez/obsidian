define(function (require) {
    'use strict';

    var app = require('./../module');

    var ng = require('angular');

    app.directive('fallbackSrc', function() {
        var fallbackSrc = {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.bind('error', function() {
                    ng.element(this).attr('src', attrs.fallbackSrc);
                });
            }
        };
        return fallbackSrc;
    });
});
