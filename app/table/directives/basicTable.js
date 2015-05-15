/**
 * Created by alex on 4/23/15.
 */
define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./basic.html');

    app.directive('basicTable', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/basic.html',
            replace: true,
            scope: {
                table: '=basicTable',
                classes: '@class'
            }
        };
    }]);
});
