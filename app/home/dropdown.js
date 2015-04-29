/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./module');

    app.directive('dropdownToggle', ['$document', function ($document) {
        return {
            restrict: 'C',
            scope: {
                selected: '='
            },
            link: function (scope, element) {
                function documentClickHandler() {
                    scope.$apply(function () {
                        scope.selected = false;
                    });
                }

                $document.on('click', documentClickHandler);

                element.on('click', function (event) {
                    scope.$apply(function () {
                        scope.selected = !scope.selected;
                    });
                    event.stopPropagation();
                });

                element.parent().on('click', function () {
                    scope.$apply(function () {
                        scope.selected = false;
                    });

                    event.stopPropagation();
                });

                scope.$on('$destroy', function () {
                    $document.off('click', documentClickHandler);
                });

                scope.$watch('selected', function (value) {
                    if (value) {
                        element.parent().addClass('open');
                    } else {
                        element.parent().removeClass('open');
                    }
                });
            }
        };
    }]);
});
