define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.directive('modalAnimationClass', [function () {
        return {
            compile: function (tElement, tAttrs) {
                if (tAttrs.modalAnimation) {
                    tElement.addClass(tAttrs.modalAnimationClass);
                }
            }
        };
    }]);
});
