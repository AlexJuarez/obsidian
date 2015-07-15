define(function (require) {
    'use strict';

    var app = require('./../module');

    app.directive('dropdownToggle', ['$document', function ($document) {
        return {
            restrict: 'C',
            scope: {
                selected: '='
            },
            link: function (scope, element) {
                var permOpen = element.parent().hasClass('open');

                function documentClickHandler() {
                    if (!scope.clicked) {
                        scope.$apply(function () {
                            scope.selected = false;
                        });
                    } else {
                        scope.clicked = false;
                    }
                    scope.toggle = false;
                }

                $document.on('click', documentClickHandler);

                element.on('click', function () {
                    scope.clicked = true;
                    scope.toggle = true;

                    scope.$apply(function () {
                        scope.selected = !scope.selected;
                    });
                });

                element.parent().on('click', function (event) {
                    if (!scope.toggle) {
                        scope.clicked = (event.target.tagName !== 'A');
                    } else {
                        scope.clicked = true;
                    }
                });

                scope.$on('$destroy', function () {
                    $document.off('click', documentClickHandler);
                });

                scope.$watch('selected', function (value) {
                    if (!permOpen){
                        if (value) {
                            element.parent().addClass('open');
                        } else {
                            element.parent().removeClass('open');
                        }
                    }
                });
            }
        };
    }]);
});
