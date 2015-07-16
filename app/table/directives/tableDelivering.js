define(function (require) {
    'use strict';

    var app = require('./../module');
    require('tpl!./tableDelivering.html');

    app.directive('tableDelivering', [function () {
        return {
            restrict: 'A',
            templateUrl: 'table/directives/tableDelivering.html',
            replace: true,
            scope: {
                delivering: '=delivering',
                classes: '@class'
            },
            link: function () {
            }
        };
    }]);
});
