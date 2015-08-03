/* globals $ */

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
    

    app.directive('tooltip', ['$templateCache', '$rootScope', '$compile', '$document', '$parse', '$timeout', '$window', '$controller', function ($templateCache, $rootScope, $compile, $document, $parse, $timeout, $window, $controller) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem, attr) {
                //console.log( 'directive scope: ', scope );
                scope.updatePosition = updatePosition;
                scope.calculateClass = calculateClass;
                scope.calculateDims = calculateDims;
                
                scope.toggleVisible = toggleVisible;
                scope.documentClickHandler = documentClickHandler;


                var tooltip = attr.tooltip;
                var overflow = attr.tooltipOverflow;
                scope.main = elem.html();
                var baseTemplate = $templateCache.get('core/directives/tooltip.html');
                var isBasicTooltip = true;
                var elements, ctrlInstance;
                scope.isOpen = false;


                scope.$watch(tooltip, function (newValue) {
                    var template = $templateCache.get(newValue);
                    if (!template) {
                        scope.content = newValue;
                    } else {
                        console.log( 'directive scope: ', scope );
                        
                        scope.content = template;
                        
                        isBasicTooltip = false;

                        // if (attr.customControl) {
                        //     var customController = attr.customControl;
                            
                        //     $controller( customController, { $scope: scope } );
                            
                        // }
                        
                    }
                    
                    elem.html( $compile(baseTemplate)(scope) );

                    
                });

                function toggleVisible() {
                    if (elem.hasClass('click')) {

                        console.log( '--- toggleVisible ---', scope.isOpen );
                        
                        scope.isOpen = !scope.isOpen;

                        if (scope.isOpen) {
                            $timeout(function() {
                                $(document).on('click', scope.documentClickHandler);    
                            }, 500);
                            
                        } else {
                            $timeout(function() {
                                $(document).off('click', scope.documentClickHandler);    
                            }, 500);
                        }

                        console.log( '--- toggleVisible ---', scope.isOpen );
                    }

                };

                function documentClickHandler(e) {
                    //e.stopPropagation();
                    if (elem !== e.target && !elem[0].contains(e.target)) {
                        console.log( 'documentClickHandler' );
                        scope.$apply(function() {
                            console.log( 'doc hit' );
                            scope.toggleVisible();
                            //scope.isOpen = false;
                        });
                    }

                }
               

                function calculateClass(dims) {
                    ng.forEach(directionClasses, function (c) {
                        elem.removeClass(c);
                    });

                    var topBuffer, leftRightBuffer;
                    if (isBasicTooltip) {
                        topBuffer = 50;
                        leftRightBuffer = 200;
                    } else {
                        topBuffer = 410;
                        leftRightBuffer = 380;
                    }

                    if (dims.top > topBuffer) {
                        if (dims.left > leftRightBuffer && dims.right > leftRightBuffer) {
                            return 'tooltip-top-center';
                        } else if (dims.left > dims.right) {
                            return 'tooltip-top-left';
                        } else {
                            return 'tooltip-top-right';
                        }
                    } else {
                        if (dims.left > leftRightBuffer && dims.right > leftRightBuffer) {
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
