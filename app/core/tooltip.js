define(function (require) {
    'use strict';

    var app = require('./module');
    var ng = require('angular');

    var directionClasses = [
        'tooltip-middle-left', 'tooltip-middle-right', 'tooltip-top-left', 'tooltip-top-center',
        'tooltip-top-right',
        'tooltip-bottom-left',
        'tooltip-bottom-center',
        'tooltip-bottom-right'
    ];

    require('tpl!./tooltip.html');

    app.directive('tooltip', ['$templateCache', '$compile', '$document', function ($templateCache, $compile, $document) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, elem, attr) {

                scope.updatePosition = updatePosition;

                var tooltip = attr.tooltip;
                scope.main = elem.html();
                var baseTemplate = $templateCache.get('core/tooltip.html');

                scope.$watch(tooltip, function (newValue) {
                    var template = $templateCache.get(newValue);
                    if (!template) {
                        scope.content = newValue;
                    } else {
                        scope.content = $compile(template)(scope);
                    }
                    elem.html($compile(baseTemplate)(scope));
                });

                function updatePosition() {
                    var elementOffset = elem[0].getBoundingClientRect();
                    var doc = $document[0].documentElement;

                    var dims = {
                        right: doc.clientWidth - elementOffset.right,
                        left: elementOffset.left,
                        top: elementOffset.top,
                        bottom: doc.clientHeight - elementOffset.bottom
                    };

                    ng.forEach(directionClasses, function (c) {
                        elem.removeClass(c);
                    });

                    console.log(dims.top);

                    if (dims.top > 50) {
                        if (dims.left > 200 && dims.right > 200) {
                            elem.addClass('tooltip-top-center');
                        } else if (dims.left > dims.right) {
                            elem.addClass('tooltip-top-left');
                        } else {
                            elem.addClass('tooltip-top-right');
                        }
                    } else {
                        if (dims.left > 200 && dims.right > 200) {
                            elem.addClass('tooltip-bottom-center');
                        } else if (dims.left > dims.right) {
                            elem.addClass('tooltip-bottom-left');
                        } else {
                            elem.addClass('tooltip-bottom-right');
                        }
                    }
                }
            }
        };
    }]);
});
