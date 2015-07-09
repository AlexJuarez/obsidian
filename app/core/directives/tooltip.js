define(function (require) {
    'use strict';

    var app = require('./../module');
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
                scope.calculateClass = calculateClass;
                scope.calculateDims = calculateDims;

                var tooltip = attr.tooltip;
                var overflow = attr.tooltipOverflow;
                scope.main = elem.html();
                var baseTemplate = $templateCache.get('core/directives/tooltip.html');

                scope.$watch(tooltip, function (newValue) {
                    var template = $templateCache.get(newValue);
                    if (!template) {
                        scope.content = newValue;
                    } else {
                        scope.content = $compile(template)(scope);
                    }
                    elem.html($compile(baseTemplate)(scope));
                });

                function calculateClass(dims) {
                    ng.forEach(directionClasses, function (c) {
                        elem.removeClass(c);
                    });

                    if (dims.top > 50) {
                        if (dims.left > 200 && dims.right > 200) {
                            return 'tooltip-top-center';
                        } else if (dims.left > dims.right) {
                            return 'tooltip-top-left';
                        } else {
                            return 'tooltip-top-right';
                        }
                    } else {
                        if (dims.left > 200 && dims.right > 200) {
                            return 'tooltip-bottom-center';
                        } else if (dims.left > dims.right) {
                            return 'tooltip-bottom-left';
                        } else {
                            return 'tooltip-bottom-right';
                        }
                    }
                }

                function calculateDims() {
                    var elementOffset = elem[0].getBoundingClientRect();
                    var doc = $document[0].documentElement;

                    return {
                        right: doc.clientWidth - elementOffset.right,
                        left: elementOffset.left,
                        top: elementOffset.top,
                        bottom: doc.clientHeight - elementOffset.bottom
                    };
                }

                function updatePosition() {
                    if (overflow) {
                        var element = elem.find('.main')[0];
                        if (element.offsetWidth >= element.scrollWidth) {
                            elem.find('.wrapper').addClass('ng-hide');
                        } else {
                            elem.find('.wrapper').removeClass('ng-hide');
                        }
                    }

                    var dims = calculateDims();
                    elem.addClass(calculateClass(dims));
                }
            }
        };
    }]);
});
