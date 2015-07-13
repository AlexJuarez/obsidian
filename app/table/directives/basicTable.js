/**
 * Created by alex on 4/23/15.
 */
define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./basicTable.html');

    app.directive('basicTable', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/basicTable.html',
            replace: true,
            scope: {
                table: '=basicTable',
                footer: '=basicFooter',
                classes: '@class'
            }
        };
    }]);
});
