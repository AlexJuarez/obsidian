define(function (require) {
    'use strict';

    var app = require('./module');
    require('tpl!./accordion.html');

    app.directive('accordion', ['$timeout', 'storeService', function ($timeout, store) {
        return {
            restrict: 'A',
            scope: true,
            transclude: true,
            templateUrl: 'table/accordion.html',
            link: function (scope, element, attrs) {
                var id = attrs.accordion;

                store.observe(id, update);

                function update() {
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.rows = store.all(id);
                        });
                    });
                }
            }
        };
    }]);
});
