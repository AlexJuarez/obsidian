define(function (require) {
    'use strict';

    var app = require('./../module');

    require('tpl!./placeholder.html');

    app.directive('placeholder', ['$interpolate', function ($interpolate) {
        return {
            restrict: 'E',
            templateUrl: 'core/directives/placeholder.html',
            link: function ($scope, elem, attr) {
                if (attr.image) {
                    $scope.image = attr.image;
                } else if (attr.height && attr.width) {
                    var placeCageTemplate = $interpolate('http://www.placecage.com/[[width]]/[[height]]');
                    $scope.image = placeCageTemplate({
                        width: attr.width,
                        height: attr.height
                    });
                }
                $scope.style = attr.style || '';
            }
        };
    }]);
});
