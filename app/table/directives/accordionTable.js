define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./accordionTable.html');

    app.directive('accordionTable', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/accordionTable.html',
            replace: true,
            transclude: true,
            scope: {
                table: '=accordionTable',
                classes: '@class'
            },
            link: function (scope) {
                var opened = false;

                scope.init = init;

                function init(length, s){
                    if (length && !opened) {
                        s.open = opened = true;
                    }
                }
            }
        };
    }]);
});
