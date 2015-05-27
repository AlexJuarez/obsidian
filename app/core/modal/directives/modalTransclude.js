define(function (require) {
    'use strict';

    var app = require('./../../module');

    app.directive('modalTransclude', [function () {
        return {
            link: function ($scope, $element, $attrs, controller, $transclude) {
                $transclude($scope.$parent, function (clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    }]);
});
