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

    app.directive('tooltip', ['$templateCache', '$rootScope', '$compile', '$document', '$timeout', '$controller', '$parse', function ($templateCache, $rootScope, $compile, $document, $timeout, $controller, $parse) {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, elem, attr) {
                scope.updatePosition = updatePosition;
                scope.calculateClass = calculateClass;
                scope.calculateDims = calculateDims;
                scope.main = elem.html();
                scope.isOpen = false;
                scope.toggleOpen = toggleOpen;
                scope.close = closeTooltip;

                //parse the value within the current scope and set it = to the scope for main
                scope.tooltipScope = attr.tooltipScope && $parse(attr.tooltipScope)(scope) || scope;

                var tooltip = attr.tooltip;
                var isHover = elem.hasClass('hover');
                var overflow = attr.tooltipOverflow;
                var isBasicTooltip = true;
                var baseTemplate = $templateCache.get('core/directives/tooltip.html');

                var cleanup = $rootScope.$on('tooltip:open', function(event, id) {
                    if (id !== scope.$id) {
                        scope.isOpen = false;
                    }
                });

                scope.$on('$destroy', function() {
                    cleanup();
                });

                //watch for an open event on the scope.
                if (!isHover) {
                    scope.$watch(function() { return scope.isOpen; }, function(val) {
                        if(val) {
                            elem.addClass('open');
                        } else {
                            elem.removeClass('open');
                        }
                    });
                }

                scope.$watch(tooltip, function (newValue) {
                    elem.html($compile(baseTemplate)(scope));

                    var template = $templateCache.get(newValue);
                    if (!template) {
                        elem.find('.content').html(newValue);

                    } else {
                        isBasicTooltip = false;

                        if (scope.creativeData) {
                            scope.name = scope.creativeData.name;
                        }

                        if (attr.tooltipController) {
                            var customController = attr.tooltipController;
                            $controller(customController, { $scope: scope });
                        }


                        var content = $compile(template)(scope);
                        elem.find('.content').html(content);
                    }
                }, true);

                function closeTooltip() {
                    scope.isOpen = false;
                }

                function toggleOpen() {
                    if (!scope.isOpen) {
                        $rootScope.$broadcast('tooltip:open', scope.$id);
                    }

                    scope.isOpen = !scope.isOpen;
                }

                function calculateClass(dims) {
                    //follow the height and width by about 20px;

                    var content = elem.find('.content')[0];

                    var topBuffer = ((content && content.offsetHeight) || 30) + 20,
                        leftRightBuffer = ((content && content.offsetWidth) || 180) + 20;

                    var output = 'tooltip';

                    if (dims.top > topBuffer) {
                        output += '-top';
                    } else {
                        output += '-bottom';
                    }

                    if (dims.left > leftRightBuffer && dims.right > leftRightBuffer) {
                        output += '-center';
                    } else if (dims.left > dims.right) {
                        output += '-left';
                    } else {
                        output += '-right';
                    }

                    return output;
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
                    hideIfNotOverflowed();

                    var dims = calculateDims();
                    var c = calculateClass(dims);

                    if (!elem.hasClass(c)) {
                        ng.forEach(directionClasses, function (c) {
                            elem.removeClass(c);
                        });
                        elem.addClass(c);
                    }
                }

                function hideIfNotOverflowed() {
                    if (overflow) {
                        var element = elem.find('.main')[0];
                        if (element.offsetWidth >= element.scrollWidth) {
                            elem.find('.wrapper').addClass('ng-hide');
                        } else {
                            elem.find('.wrapper').removeClass('ng-hide');
                        }
                    }
                }

            }
        };
    }]);
});
