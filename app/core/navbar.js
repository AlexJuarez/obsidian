/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./module');
    require('tpl!./navbar.html');

    app.directive('navbar', [function () {
        return {
            restrict: 'C',
            transclude: true,
            scope: {
                open: '='
            },
            templateUrl: 'core/navbar.html',
            link: function(scope, element) {
                scope.$watch('open', function (value) {
                    console.log(value);
                    if(value) {
                        element.addClass('navbar-open');
                    } else {
                        element.removeClass('navbar-open');
                    }
                });
            }
        };
    }]);
});
