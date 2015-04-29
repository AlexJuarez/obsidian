/**
 * Created by alex on 4/15/15.
 */
define(function (require) {
    'use strict';

    var app = require('./module');
    var ng = require('angular');

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

                element.parent().on('click', function (event) {
                    var $elem = ng.element(event.target);

                    scope.$apply(function () {
                        if ($elem.hasClass('dropdown-toggle')) {
                            scope.selected = !scope.selected;
                        } else {
                            scope.selected = false;
                        }
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
