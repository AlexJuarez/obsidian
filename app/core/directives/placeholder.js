define(function (require) {
    'use strict';

    var app = require('./../module');

    require('tpl!./placeholder.html');

    app.directive('placeholder', [function () {
        return {
            restrict: 'E',
            templateUrl: 'core/directives/placeholder.html',
            link: function ($scope, elem, attr) {
                $scope.image = attr.image;
            }
        };
    }]);
});
