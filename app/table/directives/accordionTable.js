define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./accordionTable.html');

    app.directive('accordionTable', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/accordionTable.html',
            replace: true,
            scope: {
                table: '=accordionTable',
                classes: '@class'
            }
        };
    }]);
});
