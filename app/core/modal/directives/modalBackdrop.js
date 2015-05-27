define(function (require) {
    'use strict';

    var app = require('./../../module');
    require('tpl!./../modalBackground.html');

    app.directive('modalBackdrop', ['$document', function ($document) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'core/modal/modalBackground.html',
            compile: function (tElement, tAttrs) {
                tElement.addClass(tAttrs.backdropClass);
                return linkFn;
            }
        };

        function linkFn(scope, element, attrs) {
            scope.animate = false;

            //trigger CSS transitions
            $timeout(function () {
                scope.animate = true;
            });
        }
    }]);
});
