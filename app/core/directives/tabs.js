define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('tabs', [function () {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'core/directives/tabs.html',
            transclude: true,
            link: function() {
                debugger;
            }
        };
    }]);
});
