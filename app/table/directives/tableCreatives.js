define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./tableCreatives.html');

    app.directive('tableCreatives', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/tableCreatives.html',
            replace: true,
            scope: {
                creatives: '=creatives',
                classes: '@class'
            },
            link: function (scope) {
            }
        };
    }]);
});
