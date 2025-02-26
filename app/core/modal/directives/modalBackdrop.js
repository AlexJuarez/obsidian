define(function (require) {
    'use strict';

    var app = require('./../../module');
    var template = require('tpl!./../modalBackground.html');

    app.directive('modalBackdrop', ['$timeout', function ($timeout) {
        function linkFn(scope) {
            scope.animate = false;

            //trigger CSS transitions
            $timeout(function () {
                scope.animate = true;
            });
        }

        return {
            restrict: 'EA',
            replace: true,
            template: template,
            compile: function (tElement, tAttrs) {
                tElement.addClass(tAttrs.backdropClass);
                return linkFn;
            }
        };
    }]);
});
